package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * AI异常建议DTO
 */
@Data
@Builder
public class AnomalyAdvice {
    private String anomalyType;
    private String severity;
    private List<ScoredSolution> solutions;
    private double confidence;
    private String reasoning;
    
    @Data
    @Builder
    public static class ScoredSolution {
        private String action;
        private String description;
        private double baseScore;
        private double adjustedScore;
        private String risk;
        private double cost;
    }
}
