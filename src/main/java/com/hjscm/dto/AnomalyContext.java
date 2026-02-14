package com.hjscm.dto;

import lombok.Data;

/**
 * 异常上下文DTO
 */
@Data
public class AnomalyContext {
    private AnomalyEntity anomaly;
    private String materialName;
    private Double targetTurnover;
    private HistoricalCase historicalSimilar;
    
    @Data
    public static class HistoricalCase {
        private String action;
        private double successRate;
        private int usageCount;
    }
}
