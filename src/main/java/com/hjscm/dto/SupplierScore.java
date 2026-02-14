package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * 供应商评分DTO
 */
@Data
@Builder
public class SupplierScore {
    private String supplierId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private double qualityScore;    // 质量 (40%)
    private double deliveryScore;   // 交付 (30%)
    private double priceScore;      // 价格 (20%)
    private double serviceScore;    // 服务 (10%)
    private double totalScore;
    private String grade;
    private double trend;            // 趋势 %
    private int rank;
}
