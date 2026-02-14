package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 生产工单服务
 * 与 MRP 联动
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductionOrderService {

    private final ProductionOrderRepository orderRepository;
    private final ProductionIssueRepository issueRepository;
    private final ProductionCompletionRepository completionRepository;
    private final InventoryChangeService inventoryService;
    private final MrpEngineService mrpService;
    private final TraceIdService traceService;

    /**
     * 创建生产工单（从 MRP 结果）
     */
    @Transactional
    public ProductionOrder createFromMrp(MrpNetRequirement mrpReq, String sourceMoId) {
        log.info("[Production] Creating WO from MRP: material={} qty={}", 
            mrpReq.getItemCode(), mrpReq.getNetRequirement());
        
        // 生成 Trace ID
        String traceId = traceService.generateRequirementTraceId(mrpReq.getItemCode());
        
        // 创建工单
        ProductionOrder order = ProductionOrder.builder()
            .orderCode("MO-" + System.currentTimeMillis())
            .materialCode(mrpReq.getItemCode())
            .quantity(mrpReq.getNetRequirement())
            .planStartDate(LocalDate.now())
            .planEndDate(mrpReq.getRequiredDate())
            .status("PENDING")
            .plantCode("QINGDAO")
            .mrpTraceId(mrpReq.getTraceId())
            .sourceMoId(sourceMoId)
            .traceId(traceId)
            .createdAt(LocalDateTime.now())
            .build();
        
        return orderRepository.save(order);
    }

    /**
     * 汇报完工
     */
    @Transactional
    public CompletionResult reportCompletion(CompletionReport report) {
        log.info("[Production] Reporting completion: order={} qty={}", 
            report.getOrderId(), report.getCompletedQty());
        
        // 1. 更新工单状态
        ProductionOrder order = orderRepository.findById(report.getOrderId())
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + report.getOrderId()));
        
        order.setActualEndDate(LocalDate.now());
        order.setCompletedQty(report.getCompletedQty());
        order.setStatus(order.getQuantity().compareTo(report.getCompletedQty()) <= 0 
            ? "COMPLETED" : "PARTIALLY_COMPLETED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // 2. 记录完工
        ProductionCompletion completion = ProductionCompletion.builder()
            .orderId(report.getOrderId())
            .completedQty(report.getCompletedQty())
            .completedDate(LocalDate.now())
            .qualityStatus(report.getQualityStatus())
            .batchNo(report.getBatchNo())
            .traceId(order.getTraceId())
            .createdAt(LocalDateTime.now())
            .build();
        completionRepository.save(completion);
        
        // 3. 更新库存（成品入库）
        inventoryService.processChange(InventoryChangeService.InventoryChange.builder()
            .transType("GR")
            .transCode("GR-" + report.getOrderId())
            .materialCode(order.getMaterialCode())
            .plantCode(order.getPlantCode())
            .transQty(report.getCompletedQty())
            .batchNo(report.getBatchNo())
            .traceId(order.getTraceId())
            .transAt(LocalDateTime.now())
            .build());
        
        return CompletionResult.builder()
            .orderId(order.getOrderCode())
            .status(order.getStatus())
            .completedQty(report.getCompletedQty())
            .traceId(order.getTraceId())
            .build();
    }

    /**
     * 汇报投料
     */
    @Transactional
    public IssueResult reportIssue(IssueReport report) {
        log.info("[Production] Reporting issue: order={} material={} qty={}", 
            report.getOrderId(), report.getMaterialCode(), report.getIssueQty());
        
        ProductionOrder order = orderRepository.findById(report.getOrderId())
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + report.getOrderId()));
        
        // 1. 记录投料
        ProductionIssue issue = ProductionIssue.builder()
            .orderId(report.getOrderId())
            .materialCode(report.getMaterialCode())
            .issueQty(report.getIssueQty())
            .batchNo(report.getBatchNo())
            .workstationCode(report.getWorkstationCode())
            .issuedAt(LocalDateTime.now())
            .traceId(order.getTraceId())
            .build();
        issueRepository.save(issue);
        
        // 2. 更新工单已投料量
        BigDecimal totalIssued = issueRepository
            .findByOrderId(report.getOrderId())
            .stream()
            .map(ProductionIssue::getIssueQty)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setIssuedQty(totalIssued);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // 3. 扣减库存
        inventoryService.processChange(InventoryChangeService.InventoryChange.builder()
            .transType("GI")
            .transCode("GI-" + report.getOrderId())
            .materialCode(report.getMaterialCode())
            .plantCode(order.getPlantCode())
            .transQty(report.getIssueQty().negate())
            .batchNo(report.getBatchNo())
            .traceId(order.getTraceId())
            .transAt(LocalDateTime.now())
            .build());
        
        return IssueResult.builder()
            .orderId(order.getOrderCode())
            .totalIssued(totalIssued)
            .remainingQty(order.getQuantity().subtract(totalIssued))
            .traceId(order.getTraceId())
            .build();
    }

    /**
     * 获取工单列表
     */
    public List<ProductionOrder> getOrders(String plantCode, String status) {
        if (status != null) {
            return orderRepository.findByPlantCodeAndStatus(plantCode, status);
        }
        return orderRepository.findByPlantCode(plantCode);
    }

    /**
     * 完工汇报请求
     */
    @lombok.Data
    @lombok.Builder
    public static class CompletionReport {
        private String orderId;
        private BigDecimal completedQty;
        private String qualityStatus;
        private String batchNo;
    }

    /**
     * 完工汇报结果
     */
    @lombok.Data
    @lombok.Builder
    public static class CompletionResult {
        private String orderId;
        private String status;
        private BigDecimal completedQty;
        private String traceId;
    }

    /**
     * 投料汇报请求
     */
    @lombok.Data
    @lombok.Builder
    public static class IssueReport {
        private String orderId;
        private String materialCode;
        private BigDecimal issueQty;
        private String batchNo;
        private String workstationCode;
    }

    /**
     * 投料汇报结果
     */
    @lombok.Data
    @lombok.Builder
    public static class IssueResult {
        private String orderId;
        private BigDecimal totalIssued;
        private BigDecimal remainingQty;
        private String traceId;
    }
}
