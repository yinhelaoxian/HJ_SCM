package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 呆滞检测结果DTO
 */
@Data
@Builder
public class StagnationDetectionResult {
    private List<StagnationItem> items;
    private int totalChecked;
    private int stagnationCount;
    private int highRiskCount;
    
    @Data
    @Builder
    public static class StagnationItem {
        private String materialId;
        private String batchNumber;
        private BigDecimal quantity;
        private int daysInStock;
        private double turnoverRate;
        private int riskScore;
        private String riskLevel;
        private List<String> recommendations;
    }
}
