package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * MRP Engine Service - 约束优化物料需求计划
 * V1.1框架: Process-Centric, Single Source of Truth
 * 
 * 功能：
 * - 汇总物料需求
 * - 计算库存缺口
 * - 应用约束（MOQ/交期/产能）
 * - 生成采购建议
 */
@Service
public class MRPEngineService {

    @Autowired
    private MaterialDemandRepository demandRepository;
    
    @Autowired
    private InventoryBalanceRepository inventoryRepository;
    
    @Autowired
    private InTransitOrderRepository inTransitRepository;
    
    @Autowired
    private MRPConstraintRepository constraintRepository;
    
    @Autowired
    private TraceIdService traceIdService;

    // 默认配置
    private static final int DEFAULT_LEAD_TIME = 7;
    private static final int DEFAULT_MOQ = 100;

    /**
     * MRP计算核心方法
     * 
     * @param request MRP计算请求
     * @return MRP计算结果
     */
    public MRPResult calculateMRP(MRPRequest request) {
        long startTime = System.currentTimeMillis();
        List<String> warnings = new ArrayList<>();
        List<String> conflicts = new ArrayList<>();
        
        try {
            // Step 1: 汇总物料需求
            Map<String, Double> totalDemand = aggregateDemand(request);
            
            // Step 2: 查询可用库存
            Map<String, Double> availableStock = getAvailableStock(request.getMaterialIds());
            
            // Step 3: 查询在途库存
            Map<String, Double> inTransitStock = getInTransitStock(
                request.getMaterialIds(), 
                request.getPlanningHorizon()
            );
            
            // Step 4: 查询约束配置
            Map<String, MRPConstraint> constraints = getConstraints(request.getMaterialIds());
            
            // Step 5: 计算缺口并生成建议
            Map<String, MRPSuggestion> suggestions = new HashMap<>();
            
            for (String materialId : totalDemand.keySet()) {
                double demand = totalDemand.getOrDefault(materialId, 0.0);
                double stock = availableStock.getOrDefault(materialId, 0.0);
                double inTransit = inTransitStock.getOrDefault(materialId, 0.0);
                MRPConstraint constraint = constraints.get(materialId);
                
                // 计算净需求
                double netRequirement = demand - stock - inTransit;
                
                if (netRequirement > 0) {
                    // 应用约束
                    MRPSuggestion suggestion = applyConstraints(
                        materialId, netRequirement, constraint, conflicts
                    );
                    suggestions.put(materialId, suggestion);
                    
                    // 记录医养追溯标记
                    if (isMedicalMaterial(materialId)) {
                        suggestion.setMedicalRequired(true);
                        suggestion.setBatchTrackingRequired(true);
                    }
                }
            }
            
            // Step 6: 生成Trace ID
            if (request.getSourceSoId() != null) {
                traceIdService.generateTraceId(
                    "MRP", 
                    "MRP-" + UUID.randomUUID().toString().substring(0, 8),
                    traceIdService.getTraceIdByDocument("SO", request.getSourceSoId())
                );
            }
            
            long calcTime = System.currentTimeMillis() - startTime;
            
            // 性能检查
            if (calcTime > 30000) {
                warnings.add("MRP计算时间超过30秒，建议优化");
            }
            
            return MRPResult.builder()
                .suggestions(suggestions)
                .calculationTimeMs(calcTime)
                .planningHorizon(request.getPlanningHorizon())
                .warnings(warnings)
                .conflicts(conflicts)
                .success(true)
                .build();
                
        } catch (Exception e) {
            return MRPResult.builder()
                .success(false)
                .errorMessage("MRP计算失败: " + e.getMessage())
                .calculationTimeMs(System.currentTimeMillis() - startTime)
                .build();
        }
    }

    /**
     * 汇总物料需求
     */
    private Map<String, Double> aggregateDemand(MRPRequest request) {
        Map<String, Double> demand = new HashMap<>();
        
        // 1. 汇总销售订单需求
        if (request.getSourceSoId() != null) {
            List<SalesOrderItem> items = demandRepository
                .findSalesOrderItemsBySoId(request.getSourceSoId());
            items.forEach(item -> demand.merge(
                item.getMaterialId(), 
                item.getQuantity(), 
                Double::sum
            ));
        }
        
        // 2. 汇总预测需求
        if (request.getDemandForecast() != null) {
            request.getDemandForecast().forEach((k, v) -> 
                demand.merge(k, v, Double::sum)
            );
        }
        
        return demand;
    }

    /**
     * 查询可用库存
     */
    private Map<String, Double> getAvailableStock(List<String> materialIds) {
        if (materialIds == null || materialIds.isEmpty()) {
            return new HashMap<>();
        }
        
        return inventoryRepository
            .findByMaterialIdIn(materialIds)
            .stream()
            .collect(Collectors.toMap(
                InventoryBalance::getMaterialId,
                bal -> bal.getQuantity() - bal.getReservedQty(),
                Double::sum
            ));
    }

    /**
     * 查询在途库存
     */
    private Map<String, Double> getInTransitStock(
            List<String> materialIds, 
            LocalDate horizon) {
        
        if (materialIds == null || materialIds.isEmpty()) {
            return new HashMap<>();
        }
        
        return inTransitRepository
            .findInTransitByMaterialIdsAndArrivalDateBefore(
                materialIds, 
                horizon
            )
            .stream()
            .collect(Collectors.toMap(
                InTransitOrder::getMaterialId,
                InTransitOrder::getQuantity,
                Double::sum
            ));
    }

    /**
     * 查询约束配置
     */
    private Map<String, MRPConstraint> getConstraints(List<String> materialIds) {
        if (materialIds == null || materialIds.isEmpty()) {
            return new HashMap<>();
        }
        
        return constraintRepository
            .findByMaterialIdIn(materialIds)
            .stream()
            .collect(Collectors.toMap(
                MRPConstraint::getMaterialId,
                c -> c,
                (c1, c2) -> c1
            ));
    }

    /**
     * 应用约束并生成采购建议
     */
    private MRPSuggestion applyConstraints(
            String materialId,
            double netRequirement,
            MRPConstraint constraint,
            List<String> conflicts) {
        
        double suggestedQty = netRequirement;
        List<String> reasons = new ArrayList<>();
        
        if (constraint != null) {
            // MOQ约束
            int moq = constraint.getMoq() != null ? constraint.getMoq() : DEFAULT_MOQ;
            if (netRequirement < moq) {
                suggestedQty = moq;
                conflicts.add(String.format(
                    "[%s] 需求(%d) < MOQ(%d)，建议数量调整为%d", 
                    materialId, (int)netRequirement, moq, moq
                ));
            }
            
            // 批量约束
            if (constraint.getBatchSize() != null) {
                double batches = Math.ceil(suggestedQty / constraint.getBatchSize());
                suggestedQty = batches * constraint.getBatchSize();
                reasons.add(String.format(
                    "按批量%d整除", constraint.getBatchSize()
                ));
            }
            
            // 替代物料建议
            if (constraint.getAlternativeMaterialId() != null) {
                reasons.add(String.format(
                    "可考虑替代物料: %s", 
                    constraint.getAlternativeMaterialId()
                ));
            }
        }
        
        // 计算建议交期
        LocalDate suggestedDate = LocalDate.now().plusDays(
            constraint != null && constraint.getLeadTime() != null 
                ? constraint.getLeadTime() 
                : DEFAULT_LEAD_TIME
        );
        
        // 计算置信度
        double confidence = calculateConfidence(materialId, constraint);
        
        return MRPSuggestion.builder()
            .materialId(materialId)
            .netRequirement(netRequirement)
            .suggestedQuantity(suggestedQty)
            .suggestedDate(suggestedDate)
            .alternativeSupplierId(constraint != null ? constraint.getPreferredSupplierId() : null)
            .confidence(confidence)
            .reasons(reasons)
            .medicalRequired(isMedicalMaterial(materialId))
            .batchTrackingRequired(isMedicalMaterial(materialId))
            .build();
    }

    /**
     * 判断是否为医养物料（需要严格追溯）
     */
    private boolean isMedicalMaterial(String materialId) {
        // 从物料属性判断，或从配置表查询
        return materialId != null && (
            materialId.startsWith("MED-") || 
            materialId.startsWith("IMP-")
        );
    }

    /**
     * 计算置信度
     */
    private double calculateConfidence(String materialId, MRPConstraint constraint) {
        double base = 0.85;
        
        // 有约束数据置信度更高
        if (constraint != null) {
            base += 0.05;
        }
        
        // 在途数据置信度
        if (constraint != null && constraint.getLeadTime() != null) {
            base += 0.05;
        }
        
        return Math.min(base, 0.98);
    }
}
