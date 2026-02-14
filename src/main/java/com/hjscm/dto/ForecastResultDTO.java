package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

/**
 * 预测结果DTO
 */
@Data
@Builder
public class ForecastResultDTO {
    private String materialId;
    private List<ForecastItem> forecasts;
    private List<ConfidenceInterval> confidenceIntervals;
    private Map<String, Double> seasonalFactors;
    private Double trendFactor;
    private Double accuracy;
    private List<AnomalyItem> anomalies;
    private Date generatedAt;
}
