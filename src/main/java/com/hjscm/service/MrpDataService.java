package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * MRP Data Service - 提供 MRP 引擎所需数据
 * 
 * 功能：
 * - MPS 需求查询
 * - 供应商匹配
 * - MRP 结果保存
 * 
 * @DataSeeding 目前使用 Mock 数据，后续对接真实 MPS 模块
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MrpDataService {

    private final MaterialDemandRepository demandRepository;
    private final InventoryBalanceRepository inventoryRepository;
    private final InTransitOrderRepository inTransitRepository;
    private final MRPConstraintRepository constraintRepository;
    private final BomRepository bomRepository;
    private final ProcurementSuggestionRepository procurementRepository;
    private final TraceIdService traceIdService;

    /**
     * 获取 MPS 需求（模拟数据）
     * 
     * TODO: 后续对接真实的 MPS 模块
     */
    public List<MpsRequirement> getMpsRequirements(MrpRunRequest request) {
        // 模拟 MPS 需求数据
        List<MpsRequirement> mockRequirements = Arrays.asList(
            MpsRequirement.builder()
                .id("MPS-001")
                .materialCode("MAT-LA23")
                .materialName("HJ-LA23 线性推杆")
                .quantity(1000)
                .unit("PCS")
                .dueDate(request.getPlanFromDate().plusWeeks(2))
                .priority("HIGH")
                .source("MPS-2026-01")
                .build(),
                
            MpsRequirement.builder()
                .id("MPS-002")
                .materialCode("MAT-M15")
                .materialName("HJ-M15 电机")
                .quantity(500)
                .unit("PCS")
                .dueDate(request.getPlanFromDate().plusWeeks(3))
                .priority("MEDIUM")
                .source("MPS-2026-01")
                .build(),
                
            MpsRequirement.builder()
                .id("MPS-003")
                .materialCode("MAT-SP03")
                .materialName("HJ-SP03 弹簧")
                .quantity(2000)
                .unit("PCS")
                .dueDate(request.getPlanFromDate().plusWeeks(2))
                .priority("HIGH")
                .source("MPS-2026-01")
                .build()
        );
        
        log.info("[MRP-Data] Retrieved {} MPS requirements", mockRequirements.size());
        return mockRequirements;
    }

    /**
     * 获取物料当前库存
     */
    public BigDecimal getOnHand(String materialCode, LocalDate date) {
        return inventoryRepository
            .findByMaterialCodeAndAsOfDate(materialCode, date)
            .map(InventoryBalance::getQuantity)
            .orElse(BigDecimal.valueOf(500)); // 默认库存
    }

    /**
     * 获取在途数量
     */
    public BigDecimal getInTransit(String materialCode, LocalDate date) {
        return inTransitRepository
            .findByMaterialCodeAndArrivalDateAfter(materialCode, date)
            .stream()
            .map(InTransitOrderEntity::getOrderQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 获取已分配数量
     */
    public BigDecimal getAllocated(String materialCode, LocalDate date) {
        // TODO: 从预留表查询
        return BigDecimal.ZERO;
    }

    /**
     * 获取安全库存
     */
    public BigDecimal getSafetyStock(String materialCode) {
        return inventoryRepository
            .getSafetyStock(materialCode);
    }

    /**
     * 获取可用库存
     */
    public BigDecimal getAvailable(String materialCode) {
        return inventoryRepository
            .findByMaterialCode(materialCode)
            .map(b -> {
                BigDecimal qty = b.getQuantity() != null ? b.getQuantity() : BigDecimal.ZERO;
                BigDecimal reserved = b.getReservedQty() != null ? b.getReservedQty() : BigDecimal.ZERO;
                return qty.subtract(reserved);
            })
            .orElse(BigDecimal.valueOf(500));
    }

    /**
     * 获取提前期
     */
    public int getLeadTime(String materialCode) {
        return constraintRepository
            .findByMaterialCode(materialCode)
            .map(c -> c.getLeadTime() != null ? c.getLeadTime() : 7)
            .orElse(7);
    }

    /**
     * 获取最小订购量
     */
    public BigDecimal getMoq(String materialCode) {
        return constraintRepository
            .findByMaterialCode(materialCode)
            .map(c -> c.getMoq() != null ? BigDecimal.valueOf(c.getMoq()) : BigDecimal.valueOf(100))
            .orElse(BigDecimal.valueOf(100));
    }

    /**
     * 查找活跃供应商
     */
    public List<SupplierInfo> findActiveSuppliers(String materialCode) {
        // 模拟供应商数据
        List<SupplierInfo> suppliers = Arrays.asList(
            SupplierInfo.builder()
                .supplierId("SUP-CN-012")
                .supplierCode("SUZHOU_JINGQU")
                .supplierName("苏州精驱科技")
                .moq(BigDecimal.valueOf(100))
                .leadTime(7)
                .price(BigDecimal.valueOf(85.00))
                .otdRate(0.95)
                .qualityRate(0.98)
                .build(),
                
            SupplierInfo.builder()
                .supplierId("SUP-TH-007")
                .supplierCode("THAI_TECH")
                .supplierName("泰国科技制造")
                .moq(BigDecimal.valueOf(200))
                .leadTime(14)
                .price(BigDecimal.valueOf(82.00))
                .otdRate(0.88)
                .qualityRate(0.92)
                .build()
        );
        
        log.info("[MRP-Data] Found {} active suppliers for {}", suppliers.size(), materialCode);
        return suppliers;
    }

    /**
     * 保存 MRP 结果
     */
    @Transactional
    public void saveMrpResults(String runId, List<MrpNetRequirement> requirements,
            KitCheckResult kitResult, List<ProcurementSuggestion> suggestions) {
        
        // 保存采购建议
        for (ProcurementSuggestion suggestion : suggestions) {
            ProcurementSuggestionEntity entity = ProcurementSuggestionEntity.builder()
                .id(UUID.randomUUID().toString())
                .suggestionCode("PSG-" + System.currentTimeMillis())
                .materialCode(suggestion.getItemCode())
                .suggestedQuantity(suggestion.getSuggestedQty())
                .suggestedDate(suggestion.getSuggestedDate())
                .supplierCode(suggestion.getSupplierCode())
                .supplierName(suggestion.getSupplierName())
                .status("PENDING")
                .mrpRunId(runId)
                .traceId(suggestion.getTraceId())
                .createdTime(java.time.LocalDateTime.now())
                .build();
            
            procurementRepository.save(entity);
        }
        
        log.info("[MRP-Data] Saved {} procurement suggestions", suggestions.size());
    }
}
