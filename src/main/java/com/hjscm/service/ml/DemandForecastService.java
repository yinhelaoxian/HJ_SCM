package com.hjscm.service;

import com.hjscm.dto.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

/**
 * 需求预测服务
 * 
 * 功能：
 * - 调用Python ML模型
 * - 预测结果封装
 * - 置信度计算
 */
@Service
public class DemandForecastService {

    /**
     * 执行需求预测
     */
    public ForecastResultDTO forecast(ForecastRequest request) {
        String materialId = request.getMaterialId();
        int weeks = request.getWeeks() != null ? request.getWeeks() : 13;
        
        // 1. 模拟ML预测结果（实际应调用Python服务）
        List<ForecastItem> forecasts = generateForecasts(materialId, weeks);
        
        // 2. 计算置信区间
        List<ConfidenceInterval> intervals = calculateIntervals(forecasts);
        
        // 3. 季节性因子
        Map<String, Double> seasonalFactors = getSeasonalFactors();
        
        // 4. 趋势因子
        double trendFactor = 1.02;
        
        // 5. 异常检测
        List<AnomalyItem> anomalies = detectAnomalies(materialId);
        
        return ForecastResultDTO.builder()
            .materialId(materialId)
            .forecasts(forecasts)
            .confidenceIntervals(intervals)
            .seasonalFactors(seasonalFactors)
            .trendFactor(trendFactor)
            .accuracy(0.87)
            .anomalies(anomalies)
            .generatedAt(new Date())
            .build();
    }

    private List<ForecastItem> generateForecasts(String materialId, int weeks) {
        List<ForecastItem> forecasts = new ArrayList<>();
        LocalDate startDate = LocalDate.now().plusWeeks(1);
        
        // 根据物料类型生成不同模式
        double baseValue = materialId.startsWith("MED") ? 500 : 
                         materialId.startsWith("IMP") ? 300 : 800;
        
        double[] seasonalPattern = materialId.startsWith("MED") ? 
            new double[]{1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0} :
            new double[]{1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.1, 1.0, 0.9, 0.8, 0.8, 0.9, 1.0};
        
        Random random = new Random(materialId.hashCode());
        
        for (int week = 0; week < weeks; week++) {
            LocalDate date = startDate.plusWeeks(week);
            double seasonal = seasonalPattern[week % 13];
            double trend = 1 + (week * 0.005);
            double noise = 0.9 + (random.nextDouble() * 0.2);
            
            int quantity = (int) Math.round(baseValue * seasonal * trend * noise);
            
            forecasts.add(ForecastItem.builder()
                .date(date)
                .week(week + 1)
                .quantity(quantity)
                .method("SEASONAL")
                .build());
        }
        
        return forecasts;
    }

    private List<ConfidenceInterval> calculateIntervals(List<ForecastItem> forecasts) {
        List<ConfidenceInterval> intervals = new ArrayList<>();
        
        for (int i = 0; i < forecasts.size(); i++) {
            ForecastItem f = forecasts.get(i);
            double confidence = 0.95 * Math.pow(0.95, i);
            double margin = f.getQuantity() * (1 - confidence) * 0.15;
            
            intervals.add(ConfidenceInterval.builder()
                .week(f.getWeek())
                .lower(Math.max(0, f.getQuantity() - margin))
                .upper(f.getQuantity() + margin)
                .confidenceLevel(confidence * 100)
                .build());
        }
        
        return intervals;
    }

    private Map<String, Double> getSeasonalFactors() {
        Map<String, Double> factors = new LinkedHashMap<>();
        String[] weeks = {"W1", "W2", "W3", "W4", "W5", "W6", "W7", 
                        "W8", "W9", "W10", "W11", "W12", "W13"};
        double[] values = {1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 
                          0.9, 0.8, 0.7, 0.8, 0.9, 1.0};
        
        for (int i = 0; i < weeks.length; i++) {
            factors.put(weeks[i], values[i]);
        }
        
        return factors;
    }

    private List<AnomalyItem> detectAnomalies(String materialId) {
        List<AnomalyItem> anomalies = new ArrayList<>();
        
        // 模拟异常检测结果
        if (materialId.contains("MED")) {
            anomalies.add(AnomalyItem.builder()
                .date(LocalDate.now().minusWeeks(3))
                .type("HIGH_SPIKE")
                .severity(0.75)
                .description("需求突增30%")
                .build());
        }
        
        return anomalies;
    }
}
