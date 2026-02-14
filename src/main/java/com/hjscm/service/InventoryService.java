package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 库存管理服务 - 多级库存视图与批次追踪
 * 
 * 功能：
 * - 多级库存查询（工厂仓/在途/寄售/退回）
 * - ATP/CTP计算
 * - 批次追踪
 * - 呆滞预警
 */
@Service
public class InventoryService {

    @Autowired
    private InventoryBalanceRepository balanceRepository;
    
    @Autowired
    private InventoryBatchRepository batchRepository;
    
    @Autowired
    private TraceIdService traceIdService;

    /**
     * 多级库存视图
     * 
     * @param request 查询请求
     * @return 多级库存结果
     */
    public MultiLevelInventoryResult getMultiLevelInventory(
            MultiLevelInventoryRequest request) {
        
        Map<String, InventoryLevel> inventoryMap = new HashMap<>();
        
        // 1. 查询工厂仓库存
        Map<String, BigDecimal> factoryStock = getFactoryStock(
            request.getMaterialIds(), 
            request.getWarehouseIds()
        );
        
        // 2. 查询在途库存
        Map<String, BigDecimal> inTransitStock = getInTransitStock(
            request.getMaterialIds(),
            request.getPlanningHorizon()
        );
        
        // 3. 查询寄售库存
        Map<String, BigDecimal> consignmentStock = getConsignmentStock(
            request.getMaterialIds()
        );
        
        // 4. 查询退回库存
        Map<String, BigDecimal> returnStock = getReturnStock(
            request.getMaterialIds()
        );
        
        // 5. 汇总各层级
        Set<String> allMaterials = new HashSet<>();
        allMaterials.addAll(factoryStock.keySet());
        allMaterials.addAll(inTransitStock.keySet());
        allMaterials.addAll(consignmentStock.keySet());
        allMaterials.addAll(returnStock.keySet());
        
        for (String materialId : allMaterials) {
            InventoryLevel level = InventoryLevel.builder()
                .materialId(materialId)
                .factoryStock(factoryStock.getOrDefault(materialId, BigDecimal.ZERO))
                .inTransitStock(inTransitStock.getOrDefault(materialId, BigDecimal.ZERO))
                .consignmentStock(consignmentStock.getOrDefault(materialId, BigDecimal.ZERO))
                .returnStock(returnStock.getOrDefault(materialId, BigDecimal.ZERO))
                .totalAvailable(factoryStock.getOrDefault(materialId, BigDecimal.ZERO))
                .build();
            
            inventoryMap.put(materialId, level);
        }
        
        return MultiLevelInventoryResult.builder()
            .inventoryLevels(inventoryMap)
            .queryTime(System.currentTimeMillis())
            .build();
    }

    /**
     * ATP计算 - Available to Promise
     * 
     * @param request ATP请求
     * @return ATP结果
     */
    public ATPResult calculateATP(ATPRequest request) {
        String materialId = request.getMaterialId();
        BigDecimal requestedQty = request.getRequestedQty();
        
        // 1. 查询可用库存
        BigDecimal availableStock = getAvailableStock(materialId, request.getWarehouseId());
        
        // 2. 查询在途库存（承诺交期前到达）
        BigDecimal inTransit = getInTransitBeforeDate(
            materialId, 
            request.getPromiseDate()
        );
        
        // 3. 查询已承诺需求
        BigDecimal committed = getCommittedDemand(materialId, request.getPromiseDate());
        
        // 4. 计算ATP
        BigDecimal atp = availableStock.add(inTransit).subtract(committed);
        
        // 5. 检查是否满足需求
        boolean canFulfill = atp.compareTo(requestedQty) >= 0;
        
        // 6. 医养物料额外检查
        List<String> warnings = new ArrayList<>();
        if (isMedicalMaterial(materialId)) {
            if (!hasBatchWithSufficientQty(materialId, requestedQty)) {
                warnings.add("医养物料无足够合规批次");
                canFulfill = false;
            }
        }
        
        return ATPResult.builder()
            .materialId(materialId)
            .requestedQty(requestedQty)
            .availableStock(availableStock)
            .inTransit(inTransit)
            .committed(committed)
            .atpQuantity(atp.max(BigDecimal.ZERO))
            .canFulfill(canFulfill)
            .warnings(warnings)
            .build();
    }

    /**
     * 批次追踪 - 正向追溯
     * 
     * @param batchId 批次ID
     * @return 追溯结果
     */
    public BatchTraceResult traceBatchForward(String batchId) {
        Optional<InventoryBatch> batch = batchRepository.findById(batchId);
        
        if (batch.isEmpty()) {
            return BatchTraceResult.builder()
                .success(false)
                .message("批次不存在")
                .build();
        }
        
        InventoryBatch b = batch.get();
        List<TraceNode> traceNodes = new ArrayList<>();
        
        // 添加入库记录
        traceNodes.add(TraceNode.builder()
            .type("GR")
            .id(b.getId())
            .date(b.getCreatedAt())
            .quantity(b.getQuantity())
            .build());
        
        // 查找后续关联（简化版，实际需要关联GR->MO->DN）
        // TODO: 实现完整的追溯链路
        
        return BatchTraceResult.builder()
            .success(true)
            .batchNumber(b.getBatchNumber())
            .traceNodes(traceNodes)
            .build();
    }

    /**
     * 呆滞检测
     * 
     * @param request 检测请求
     * @return 呆滞物料列表
     */
    public StagnationDetectionResult detectStagnation(
            StagnationDetectionRequest request) {
        
        List<StagnationItem> stagnationItems = new ArrayList<>();
        
        // 检测参数
        int maxDaysInStock = request.getMaxDaysInStock() != null 
            ? request.getMaxDaysInStock() : 90;
        double minTurnoverRate = request.getMinTurnoverRate() != null 
            ? request.getMinTurnoverRate() : 2.0;
        
        // 查询所有批次
        List<InventoryBatch> batches = batchRepository.findAll();
        
        for (InventoryBatch batch : batches) {
            if (!"AVAILABLE".equals(batch.getStatus())) continue;
            
            // 计算库龄
            int daysInStock = calculateDaysInStock(batch);
            
            // 计算周转率
            double turnoverRate = calculateTurnoverRate(batch.getMaterialId());
            
            // 检测呆滞
            if (daysInStock > maxDaysInStock || turnoverRate < minTurnoverRate) {
                int riskScore = calculateStagnationRiskScore(
                    daysInStock, turnoverRate, maxDaysInStock, minTurnoverRate
                );
                
                stagnationItems.add(StagnationItem.builder()
                    .materialId(batch.getMaterialId())
                    .batchNumber(batch.getBatchNumber())
                    .quantity(batch.getQuantity())
                    .daysInStock(daysInStock)
                    .turnoverRate(turnoverRate)
                    .riskScore(riskScore)
                    .riskLevel(riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW")
                    .recommendations(generateStagnationRecommendations(batch, daysInStock, turnoverRate))
                    .build());
            }
        }
        
        // 按风险排序
        stagnationItems.sort((a, b) -> Integer.compare(b.getRiskScore(), a.getRiskScore()));
        
        return StagnationDetectionResult.builder()
            .items(stagnationItems)
            .totalChecked(batches.size())
            .stagnationCount(stagnationItems.size())
            .highRiskCount(stagnationItems.stream()
                .filter(i -> "HIGH".equals(i.getRiskLevel()))
                .count())
            .build();
    }

    // ==================== 私有辅助方法 ====================

    private BigDecimal getFactoryStock(List<String> materialIds, List<String> warehouseIds) {
        if (materialIds == null || materialIds.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        List<InventoryBalance> balances = balanceRepository.findByMaterialIdIn(materialIds);
        return balances.stream()
            .filter(b -> warehouseIds == null || warehouseIds.isEmpty() 
                || warehouseIds.contains(b.getWarehouseId()))
            .collect(Collectors.groupingBy(
                InventoryBalance::getMaterialId,
                Collectors.reducing(
                    BigDecimal.ZERO,
                    b -> b.getAvailableQty() != null ? b.getAvailableQty() : BigDecimal.ZERO,
                    BigDecimal::add
                )
            ));
    }

    private BigDecimal getInTransitStock(List<String> materialIds, LocalDate horizon) {
        // 简化实现
        return BigDecimal.valueOf(1000);
    }

    private BigDecimal getConsignmentStock(List<String> materialIds) {
        // 简化实现
        return BigDecimal.ZERO;
    }

    private BigDecimal getReturnStock(List<String> materialIds) {
        // 简化实现
        return BigDecimal.ZERO;
    }

    private BigDecimal getAvailableStock(String materialId, String warehouseId) {
        return balanceRepository
            .findByMaterialIdAndWarehouseId(materialId, warehouseId)
            .map(InventoryBalance::getAvailableQty)
            .orElse(BigDecimal.ZERO);
    }

    private BigDecimal getInTransitBeforeDate(String materialId, LocalDate date) {
        // 简化实现
        return BigDecimal.valueOf(500);
    }

    private BigDecimal getCommittedDemand(String materialId, LocalDate date) {
        // 简化实现
        return BigDecimal.valueOf(200);
    }

    private boolean isMedicalMaterial(String materialId) {
        return materialId != null && (
            materialId.startsWith("MED-") || 
            materialId.startsWith("IMP-")
        );
    }

    private boolean hasBatchWithSufficientQty(String materialId, BigDecimal qty) {
        return batchRepository.findByMaterialId(materialId).stream()
            .filter(b -> "AVAILABLE".equals(b.getStatus()))
            .anyMatch(b -> b.getQuantity().compareTo(qty) >= 0);
    }

    private int calculateDaysInStock(InventoryBatch batch) {
        if (batch.getCreatedAt() == null) return 0;
        return (int) (LocalDateTime.now().toLocalDate().toEpochDay() 
            - batch.getCreatedAt().toLocalDate().toEpochDay());
    }

    private double calculateTurnoverRate(String materialId) {
        // 简化实现
        return 1.5;
    }

    private int calculateStagnationRiskScore(
            int daysInStock, double turnoverRate, 
            int maxDays, double minTurnover) {
        int score = 0;
        if (daysInStock > maxDays) score += 40;
        else if (daysInStock > maxDays * 0.7) score += 20;
        
        if (turnoverRate < minTurnover) score += 40;
        else if (turnoverRate < minTurnover * 1.5) score += 20;
        
        return Math.min(score, 100);
    }

    private List<String> generateStagnationRecommendations(
            InventoryBatch batch, int daysInStock, double turnoverRate) {
        List<String> recommendations = new ArrayList<>();
        
        if (daysInStock > 90) {
            recommendations.add("建议降价促销清理库存");
        }
        if (turnoverRate < 1) {
            recommendations.add("建议转售或报废");
        }
        recommendations.add("考虑调拨至其他仓库");
        
        return recommendations;
    }
}
