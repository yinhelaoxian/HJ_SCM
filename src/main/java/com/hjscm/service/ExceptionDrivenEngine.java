package com.hjscm.service;

import com.hjscm.entity.ExceptionEntity;
import com.hjscm.repository.ExceptionRepository;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 异常驱动引擎
 *
 * 功能：
 * - 动态优先级计算
 * - 异常分类与分发
 * - SLA监控
 */
@Service
public class ExceptionDrivenEngine {

    @Autowired
    private ExceptionRepository exceptionRepository;

    // 优先级权重配置
    private static final double WEIGHT_IMPACT = 0.30;
    private static final double WEIGHT_URGENCY = 0.30;
    private static final double WEIGHT_AMOUNT = 0.25;
    private static final double WEIGHT_CUSTOMER = 0.15;

    // 客户等级权重
    private static final Map<String, Double> CUSTOMER_LEVEL_WEIGHT = Map.of(
        "A", 1.0,
        "B", 0.8,
        "C", 0.6
    );

    /**
     * 创建异常
     */
    public ExceptionEntity createException(ExceptionCreateRequest request) {
        ExceptionEntity exception = ExceptionEntity.builder()
            .type(request.getType())
            .title(request.getTitle())
            .materialId(request.getMaterialId())
            .materialName(request.getMaterialName())
            .quantity(request.getQuantity())
            .amount(request.getAmount())
            .supplierId(request.getSupplierId())
            .supplierName(request.getSupplierName())
            .customerLevel(request.getCustomerLevel())
            .status("OPEN")
            .priorityScore(calculatePriorityScore(request))
            .priorityLevel(calculatePriorityLevel(request))
            .slaDeadline(calculateSLA(request))
            .createdAt(LocalDateTime.now())
            .createdBy(request.getCreatedBy())
            .build();
        
        return exceptionRepository.save(exception);
    }

    /**
     * 计算优先级分数
     * 优先级 = 影响度 × 紧急度 × 金额权重 × 客户等级
     */
    public double calculatePriorityScore(ExceptionCreateRequest request) {
        // 1. 影响度评分 (0-100)
        double impactScore = calculateImpactScore(request.getType(), request.getQuantity());
        
        // 2. 紧急度评分 (0-100)
        double urgencyScore = calculateUrgencyScore(request.getType());
        
        // 3. 金额权重评分 (0-100)
        double amountScore = normalizeAmount(request.getAmount());
        
        // 4. 客户等级权重
        double customerWeight = CUSTOMER_LEVEL_WEIGHT.getOrDefault(
            request.getCustomerLevel(), 0.5);
        
        // 综合评分
        double score = impactScore * WEIGHT_IMPACT
                    + urgencyScore * WEIGHT_URGENCY
                    + amountScore * WEIGHT_AMOUNT
                    + (customerWeight * 100) * WEIGHT_CUSTOMER;
        
        return Math.round(score * 100) / 100.0;
    }

    /**
     * 计算优先级等级
     */
    public String calculatePriorityLevel(ExceptionCreateRequest request) {
        double score = calculatePriorityScore(request);
        if (score >= 80) return "CRITICAL";
        if (score >= 60) return "HIGH";
        if (score >= 40) return "MEDIUM";
        return "LOW";
    }

    /**
     * 计算影响度评分
     */
    private double calculateImpactScore(String type, Double quantity) {
        if (quantity == null) quantity = 0.0;
        
        return switch (type) {
            case "SHORTAGE" -> {
                if (quantity > 1000) yield 95;
                if (quantity > 500) yield 85;
                if (quantity > 100) yield 70;
                yield 50;
            }
            case "DELAY" -> {
                if (quantity > 7) yield 90;
                if (quantity > 3) yield 75;
                yield 60;
            }
            case "QUALITY" -> {
                if (quantity > 0.1) yield 95;
                if (quantity > 0.05) yield 80;
                yield 65;
            }
            default -> 50;
        };
    }

    /**
     * 计算紧急度评分
     */
    private double calculateUrgencyScore(String type) {
        return switch (type) {
            case "SHORTAGE" -> 95;  // 缺料最紧急
            case "DELAY" -> 85;
            case "QUALITY" -> 80;
            default -> 50;
        };
    }

    /**
     * 金额归一化 (0-100)
     */
    private double normalizeAmount(Double amount) {
        if (amount == null) return 50;
        if (amount > 100000) return 100;
        if (amount > 50000) return 85;
        if (amount > 10000) return 70;
        if (amount > 5000) return 55;
        return 40;
    }

    /**
     * 计算SLA截止时间
     */
    private LocalDateTime calculateSLA(ExceptionCreateRequest request) {
        int hours = switch (request.getType()) {
            case "SHORTAGE" -> 4;
            case "DELAY" -> 24;
            case "QUALITY" -> 48;
            default -> 72;
        };
        
        return LocalDateTime.now().plusHours(hours);
    }

    /**
     * 获取待处理异常列表（按优先级排序）
     */
    public List<ExceptionEntity> getPendingExceptions(String assigneeId) {
        List<ExceptionEntity> exceptions = 
            exceptionRepository.findByStatus("OPEN");
        
        if (assigneeId != null) {
            exceptions = exceptions.stream()
                .filter(e -> assigneeId.equals(e.getAssignedTo()))
                .toList();
        }
        
        return exceptions.stream()
            .sorted((a, b) -> 
                Double.compare(b.getPriorityScore(), a.getPriorityScore()))
            .toList();
    }

    /**
     * 处理异常
     */
    public ExceptionEntity processException(
            String exceptionId, 
            String action,
            String remark) {
        
        ExceptionEntity exception = exceptionRepository.findById(exceptionId)
            .orElseThrow();
        
        exception.setStatus("PROCESSING");
        exception.setProcessedAt(LocalDateTime.now());
        exception.setActionTaken(action);
        exception.setRemark(remark);
        
        return exceptionRepository.save(exception);
    }

    /**
     * 升级异常
     */
    public ExceptionEntity escalateException(
            String exceptionId,
            String reason,
            String escalateTo) {
        
        ExceptionEntity exception = exceptionRepository.findById(exceptionId)
            .orElseThrow();
        
        exception.setStatus("ESCALATED");
        exception.setEscalatedAt(LocalDateTime.now());
        exception.setEscalateReason(reason);
        exception.setEscalateTo(escalateTo);
        
        return exceptionRepository.save(exception);
    }
}
