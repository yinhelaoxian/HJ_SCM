package com.hjscm.service.ai;

import com.hjscm.dto.*;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

/**
 * 智能补货建议引擎
 * 
 * 功能：
 * - 计算最优补货量
 * - 考虑多种约束条件
 * - 平衡库存成本与服务水平
 */
@Service
public class SmartReplenishmentService {

    /**
     * 生成补货建议
     */
    public ReplenishmentSuggestion suggest(ReplenishmentContext context) {
        // 1. 计算经济订货量
        double eoq = calculateEOQ(context);
        
        // 2. 考虑安全库存
        double safetyStock = calculateSafetyStock(context);
        
        // 3. 考虑供应商最小订货量
        double minOrder = context.getSupplierMinOrder();
        
        // 4. 计算最优补货量
        double optimalQty = Math.max(
            minOrder,
            Math.ceil(Math.max(eoq, safetyStock - context.getCurrentStock()) / minOrder) * minOrder
        );
        
        // 5. 生成备选方案
        List<ReplenishmentOption> options = generateOptions(context, eoq, optimalQty);
        
        // 6. 建议补货时间
        LocalDateTime recommendedDate = calculateReplenishmentDate(context);
        
        return ReplenishmentSuggestion.builder()
            .materialId(context.getMaterialId())
            .currentStock(context.getCurrentStock())
            .optimalQty((int) optimalQty)
            .safetyStock((int) safetyStock)
            .economicOrderQty((int) eoq)
            .options(options)
            .recommendedDate(recommendedDate)
            .confidence(calculateConfidence(context))
            .reasoning(generateReasoning(context, optimalQty, options.get(0)))
            .build();
    }

    /**
     * 经济订货量 (EOQ)
     */
    private double calculateEOQ(ReplenishmentContext context) {
        double annualDemand = context.getAnnualDemand();
        double orderingCost = context.getOrderingCost();
        double unitCost = context.getUnitCost();
        double holdingRate = context.getHoldingRate();
        
        // EOQ = sqrt(2 * D * S / H)
        // H = unitCost * holdingRate
        double holdingCost = unitCost * holdingRate;
        
        return Math.sqrt(2 * annualDemand * orderingCost / holdingCost);
    }

    /**
     * 安全库存计算
     */
    private double calculateSafetyStock(ReplenishmentContext context) {
        double avgDemand = context.getAverageDailyDemand();
        double leadTime = context.getLeadTimeDays();
        double stdDev = context.getDemandStdDev();
        double serviceLevel = context.getServiceLevel(); // Z值
        
        // 安全库存 = Z * σ * sqrt(L)
        double safetyFactor = getZScore(serviceLevel);
        
        return safetyFactor * stdDev * Math.sqrt(leadTime);
    }

    /**
     * Z值查表
     */
    private double getZScore(double serviceLevel) {
        // 90%: 1.28, 95%: 1.65, 99%: 2.33
        return switch ((int)(serviceLevel * 100)) {
            case 90 -> 1.28;
            case 95 -> 1.65;
            case 99 -> 2.33;
            default -> 1.28;
        };
    }

    /**
     * 生成备选方案
     */
    private List<ReplenishmentOption> generateOptions(
            ReplenishmentContext context, 
            double eoq, 
            double optimal) {
        
        return List.of(
            // 方案1: 最小成本
            ReplenishmentOption.builder()
                .name("经济订货")
                .qty((int) Math.ceil(eoq / context.getSupplierMinOrder()) * context.getSupplierMinOrder())
                .cost(calculateTotalCost(context, eoq))
                .risk("LOW")
                .build(),
            
            // 方案2: 短期快速
            ReplenishmentOption.builder()
                .name("快速补货")
                .qty((int) (context.getSafetyStock() * 1.2))
                .cost(calculateTotalCost(context, context.getSafetyStock() * 1.2))
                .risk("MEDIUM")
                .build(),
            
            // 方案3: 长期储备
            ReplenishmentOption.builder()
                .name("批量采购")
                .qty((int) Math.ceil(optimal * 1.5 / context.getSupplierMinOrder()) * context.getSupplierMinOrder())
                .cost(calculateTotalCost(context, optimal * 1.5))
                .risk("LOW")
                .build()
        );
    }

    /**
     * 计算总成本
     */
    private double calculateTotalCost(ReplenishmentContext context, double qty) {
        double ordering = (context.getAnnualDemand() / qty) * context.getOrderingCost();
        double holding = (qty / 2) * context.getUnitCost() * context.getHoldingRate();
        double purchase = context.getAnnualDemand() * context.getUnitCost();
        return ordering + holding + purchase;
    }

    /**
     * 推荐补货日期
     */
    private LocalDateTime calculateReplenishmentDate(ReplenishmentContext context) {
        double daysUntilStockout = context.getCurrentStock() / context.getAverageDailyDemand();
        double leadTime = context.getLeadTimeDays();
        
        // 在库存耗尽前 leadTime 天补货
        return LocalDateTime.now().plusDays((long)(daysUntilStockout - leadTime));
    }

    /**
     * 生成推理说明
     */
    private String generateReasoning(
            ReplenishmentContext context, 
            double optimal,
            ReplenishmentOption best) {
        
        return String.format(
            "当前库存%d件，日均消耗%d件，供应商交期%d天。" +
            "经济订货量%d件，综合考虑最小订货量和安全库存，建议补货%d件(%s方案）。" +
            "预计在%d天后补货，可避免缺货风险。",
            context.getCurrentStock(),
            (int) context.getAverageDailyDemand(),
            (int) context.getLeadTimeDays(),
            (int) Math.ceil(optimal / 100) * 100,
            best.getQty(),
            best.getName(),
            (int)(context.getCurrentStock() / context.getAverageDailyDemand() - context.getLeadTimeDays())
        );
    }

    private double calculateConfidence(ReplenishmentContext context) {
        double confidence = 0.85;
        // 根据数据质量调整
        if (context.getHistoricalDataPoints() < 30) confidence -= 0.1;
        if (context.getDemandStdDev() > context.getAverageDailyDemand() * 0.3) confidence -= 0.05;
        return confidence;
    }
}
