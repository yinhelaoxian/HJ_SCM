package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * MRP Engine Service - 约束优化物料需求计划
 * V1.1框架: Process-Centric, Single Source of Truth, Exception-Driven
 * 
 * 功能：
 * - BOM 多级展开
 * - 物料需求计算
 * - 齐套检查
 * - 采购建议生成
 * - Trace ID 关联
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MRPEngineService {

    private final MaterialDemandRepository demandRepository;
    private final InventoryBalanceRepository inventoryRepository;
    private final InTransitOrderRepository inTransitRepository;
    private final MRPConstraintRepository constraintRepository;
    private final BomRepository bomRepository;
    private final TraceIdService traceIdService;
    private final ProcurementSuggestionRepository procurementRepository;

    // 默认配置
    private static final int DEFAULT_LEAD_TIME = 7;
    private static final int DEFAULT_MOQ = 100;
    private static final double DEFAULT_YIELD_RATE = 1.0;

    /**
     * 执行 MRP 运算（主入口）
     */
    @Transactional
    public MrpRunResponse runMrp(MrpRunRequest request) {
        long startTime = System.currentTimeMillis();
        String traceId = traceIdService.generateRunTraceId();
        
        log.info("[MRP] Run started. mode={}, from={}, to={}, traceId={}", 
            request.getRunMode(), request.getPlanFromDate(), 
            request.getPlanToDate(), traceId);
        
        try {
            // 1. 获取 MPS 需求
            List<MpsRequirement> mpsRequirements = getMpsRequirements(request);
            
            // 2. BOM 展开
            List<MrpRequirement> explodedRequirements = new ArrayList<>();
            for (MpsRequirement mps : mpsRequirements) {
                explodedRequirements.addAll(
                    explodeBom(mps.getMaterialCode(), 
                        BigDecimal.valueOf(mps.getQuantity()), 3)
                );
            }
            
            // 3. 计算净需求
            List<MrpNetRequirement> netRequirements = 
                calculateNetRequirements(explodedRequirements, request.getPlanFromDate());
            
            // 4. 齐套检查
            KitCheckResult kitResult = checkKitAvailability(netRequirements);
            
            // 5. 生成采购建议
            List<ProcurementSuggestion> suggestions = 
                generateSuggestions(kitResult.getShortages());
            
            // 6. 保存结果
            saveMrpResults(netRequirements, kitResult, suggestions);
            
            // 7. 发布事件
            publishMrpCompletedEvent(traceId, netRequirements, kitResult);
            
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("[MRP] Run completed. traceId={}, duration={}ms, requirements={}, shortages={}", 
                traceId, duration, netRequirements.size(), kitResult.getShortages().size());
            
            return MrpRunResponse.builder()
                .runId(traceId)
                .status("COMPLETED")
                .durationMs(duration)
                .requirementCount(netRequirements.size())
                .shortageCount(kitResult.getShortages().size())
                .suggestionCount(suggestions.size())
                .warnings(Collections.emptyList())
                .createdAt(LocalDate.now())
                .build();
                
        } catch (Exception e) {
            log.error("[MRP] Run failed. traceId={}", traceId, e);
            return MrpRunResponse.builder()
                .runId(traceId)
                .status("FAILED")
                .errorMessage(e.getMessage())
                .build();
        }
    }

    /**
     * BOM 多级展开
     */
    public List<MrpRequirement> explodeBom(String parentCode, 
            BigDecimal qty, int maxLevel) {
        
        List<MrpRequirement> requirements = new ArrayList<>();
        Queue<BomNode> queue = new LinkedList<>();
        
        // 根节点入队
        queue.offer(new BomNode(parentCode, qty, 0));
        
        while (!queue.isEmpty()) {
            BomNode node = queue.poll();
            
            // 达到最大层级，停止展开
            if (node.getLevel() >= maxLevel) {
                requirements.add(buildRequirement(node));
                continue;
            }
            
            // 查询子项 BOM
            List<BomLine> bomLines = bomRepository
                .findByParentItemAndActive(node.getItemCode(), true);
            
            if (bomLines.isEmpty()) {
                // 无子项，尾项
                requirements.add(buildRequirement(node));
                continue;
            }
            
            // 展开子项
            for (BomLine line : bomLines) {
                BigDecimal childQty = node.getQty()
                    .multiply(line.getUsagePerParent() != null ? line.getUsagePerParent() : BigDecimal.ONE)
                    .multiply(line.getYieldRate() != null ? line.getYieldRate() : BigDecimal.valueOf(DEFAULT_YIELD_RATE))
                    .setScale(4, RoundingMode.HALF_UP);
                
                queue.offer(new BomNode(
                    line.getChildItem(), childQty, node.getLevel() + 1));
            }
        }
        
        return requirements;
    }

    /**
     * 构建物料需求
     */
    private MrpRequirement buildRequirement(BomNode node) {
        return MrpRequirement.builder()
            .itemCode(node.getItemCode())
            .requiredQty(node.getQty())
            .level(node.getLevel())
            .traceId(traceIdService.generateRequirementTraceId(node.getItemCode()))
            .build();
    }

    /**
     * 计算净需求
     */
    private List<MrpNetRequirement> calculateNetRequirements(
            List<MrpRequirement> requirements, LocalDate fromDate) {
        
        List<MrpNetRequirement> netRequirements = new ArrayList<>();
        
        // 按物料汇总
        Map<String, MrpRequirement> requirementMap = requirements.stream()
            .collect(Collectors.groupingBy(
                MrpRequirement::getItemCode,
                Collectors.reducing(
                    new MrpRequirement(),
                    (a, b) -> MrpRequirement.builder()
                        .itemCode(a.getItemCode())
                        .requiredQty(a.getRequiredQty().add(b.getRequiredQty()))
                        .level(Math.min(a.getLevel(), b.getLevel()))
                        .build()
                )
            ));
        
        for (MrpRequirement req : requirementMap.values()) {
            // 获取库存数据
            BigDecimal onHand = getOnHand(req.getItemCode(), fromDate);
            BigDecimal inTransit = getInTransit(req.getItemCode(), fromDate);
            BigDecimal allocated = getAllocated(req.getItemCode(), fromDate);
            BigDecimal safetyStock = getSafetyStock(req.getItemCode());
            
            // 计算可用量
            BigDecimal available = onHand.add(inTransit).subtract(allocated);
            
            // 计算净需求
            BigDecimal netReq = req.getRequiredQty().subtract(available).subtract(safetyStock);
            
            if (netReq.compareTo(BigDecimal.ZERO) > 0) {
                MrpNetRequirement netReqItem = MrpNetRequirement.builder()
                    .itemCode(req.getItemCode())
                    .grossRequirement(req.getRequiredQty())
                    .availableQty(available)
                    .safetyStock(safetyStock)
                    .netRequirement(netReq)
                    .requiredDate(fromDate.plusWeeks(2))
                    .leadTime(getLeadTime(req.getItemCode()))
                    .traceId(traceIdService.generateRequirementTraceId(req.getItemCode()))
                    .build();
                
                netRequirements.add(netReqItem);
            }
        }
        
        return netRequirements;
    }

    /**
     * 齐套检查
     */
    public KitCheckResult checkKitAvailability(
            List<MrpNetRequirement> requirements) {
        
        KitCheckResult result = new KitCheckResult();
        result.setCheckDate(LocalDate.now());
        
        for (MrpNetRequirement req : requirements) {
            BigDecimal available = getAvailable(req.getItemCode());
            double fillRate = req.getNetRequirement().doubleValue() > 0 
                ? Math.min(1.0, available.doubleValue() / req.getNetRequirement().doubleValue())
                : 1.0;
            
            if (available.compareTo(req.getNetRequirement()) < 0) {
                // 缺料
                KitShortage shortage = KitShortage.builder()
                    .itemCode(req.getItemCode())
                    .requiredQty(req.getNetRequirement())
                    .availableQty(available)
                    .shortageQty(req.getNetRequirement().subtract(available))
                    .fillRate(fillRate)
                    .urgencyLevel(fillRate < 0.3 ? "CRITICAL" : 
                        fillRate < 0.6 ? "HIGH" : "MEDIUM")
                    .traceId(req.getTraceId())
                    .build();
                
                result.addShortage(shortage);
            }
            
            // 添加齐套项
            KitItem kitItem = KitItem.builder()
                .itemCode(req.getItemCode())
                .requiredQty(req.getNetRequirement())
                .availableQty(available)
                .fillRate(fillRate)
                .build();
            
            result.addKitItem(kitItem);
        }
        
        result.calculateOverallFillRate();
        return result;
    }

    /**
     * 生成采购建议
     */
    public List<ProcurementSuggestion> generateSuggestions(
            List<KitShortage> shortages) {
        
        List<ProcurementSuggestion> suggestions = new ArrayList<>();
        
        for (KitShortage shortage : shortages) {
            // 匹配供应商
            List<SupplierInfo> suppliers = findActiveSuppliers(shortage.getItemCode());
            
            if (suppliers.isEmpty()) {
                log.warn("[MRP] No supplier found for {}", shortage.getItemCode());
                continue;
            }
            
            // 选择最优供应商
            SupplierInfo best = selectBestSupplier(suppliers, shortage.getRequiredQty());
            
            // 计算建议采购量
            BigDecimal suggestedQty = calculateSuggestedQty(shortage);
            
            // 计算建议日期
            LocalDate suggestedDate = shortage.getRequiredDate() != null 
                ? shortage.getRequiredDate().minusDays(best.getLeadTime())
                : LocalDate.now().plusDays(best.getLeadTime());
            
            ProcurementSuggestion suggestion = ProcurementSuggestion.builder()
                .itemCode(shortage.getItemCode())
                .suggestedQty(suggestedQty)
                .suggestedDate(suggestedDate)
                .supplierCode(best.getSupplierCode())
                .supplierName(best.getSupplierName())
                .urgencyLevel(shortage.getUrgencyLevel())
                .traceId(traceIdService.generateSuggestionTraceId(shortage.getItemCode()))
                .build();
            
            suggestions.add(suggestion);
        }
        
        return suggestions;
    }

    /**
     * 计算建议采购量（考虑 MOQ 和包装量）
     */
    private BigDecimal calculateSuggestedQty(KitShortage shortage) {
        BigDecimal shortageQty = shortage.getShortageQty();
        BigDecimal moq = getMoq(shortage.getItemCode());
        BigDecimal packQty = getPackageQty(shortage.getItemCode());
        
        BigDecimal withLoss = shortageQty; // 可添加损耗率
        
        // 取整到包装量
        if (packQty.compareTo(BigDecimal.ONE) > 0) {
            withLoss = withLoss.divide(packQty, 0, RoundingMode.CEILING)
                .multiply(packQty);
        }
        
        return withLoss.max(moq);
    }

    /**
     * 选择最优供应商
     */
    private SupplierInfo selectBestSupplier(
            List<SupplierInfo> suppliers, BigDecimal qty) {
        
        return suppliers.stream()
            .filter(s -> s.getMoq() == null || s.getMoq().compareTo(qty) <= 0)
            .min(Comparator
                .comparingDouble((SupplierInfo s) -> s.getPrice() != null ? s.getPrice() : Double.MAX_VALUE)
                .thenComparingInt(s -> s.getLeadTime() != null ? s.getLeadTime() : DEFAULT_LEAD_TIME)
                .thenComparingDouble(s -> s.getOtdRate() != null ? -s.getOtdRate() : 0)) // OTD 越高越好
            .orElse(suppliers.get(0));
    }

    // === 查询方法 ===

    private List<MpsRequirement> getMpsRequirements(MrpRunRequest request) {
        // TODO: 从 MPS 模块获取需求
        return Collections.emptyList();
    }

    private BigDecimal getOnHand(String itemCode, LocalDate date) {
        return inventoryRepository
            .findByMaterialCodeAndAsOfDate(itemCode, date)
            .map(InventoryBalance::getQuantity)
            .orElse(BigDecimal.ZERO);
    }

    private BigDecimal getInTransit(String itemCode, LocalDate date) {
        return inTransitRepository
            .findByMaterialCodeAndArrivalDateAfter(itemCode, date)
            .stream()
            .map(InTransitOrder::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getAllocated(String itemCode, LocalDate date) {
        return BigDecimal.ZERO; // TODO: 从预留表查询
    }

    private BigDecimal getAvailable(String itemCode) {
        return inventoryRepository
            .findByMaterialCode(itemCode)
            .map(b -> b.getQuantity().subtract(b.getReservedQty()))
            .orElse(BigDecimal.ZERO);
    }

    private BigDecimal getSafetyStock(String itemCode) {
        return inventoryRepository
            .findByMaterialCode(itemCode)
            .map(InventoryBalance::getSafetyStock)
            .orElse(BigDecimal.valueOf(100));
    }

    private int getLeadTime(String itemCode) {
        return constraintRepository
            .findByMaterialCode(itemCode)
            .map(c -> c.getLeadTime() != null ? c.getLeadTime() : DEFAULT_LEAD_TIME)
            .orElse(DEFAULT_LEAD_TIME);
    }

    private BigDecimal getMoq(String itemCode) {
        return constraintRepository
            .findByMaterialCode(itemCode)
            .map(c -> c.getMoq() != null ? c.getMoq() : BigDecimal.valueOf(DEFAULT_MOQ))
            .orElse(BigDecimal.valueOf(DEFAULT_MOQ));
    }

    private BigDecimal getPackageQty(String itemCode) {
        return BigDecimal.ONE;
    }

    private List<SupplierInfo> findActiveSuppliers(String itemCode) {
        return Collections.emptyList(); // TODO: 从供应商模块查询
    }

    private void saveMrpResults(List<MrpNetRequirement> requirements,
            KitCheckResult kitResult, List<ProcurementSuggestion> suggestions) {
        // TODO: 保存到数据库
    }

    private void publishMrpCompletedEvent(String traceId,
            List<MrpNetRequirement> requirements, KitCheckResult kitResult) {
        // TODO: 发布领域事件
    }

    /**
     * BOM 展开节点
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    private static class BomNode {
        private String itemCode;
        private BigDecimal qty;
        private int level;
    }
}
