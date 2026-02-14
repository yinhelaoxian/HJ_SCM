package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 预测DTO
 */
@Data
@Builder
public class WeekForecast {
    private Integer week;
    private LocalDate date;
    private Integer forecastQuantity;
    private Integer planQuantity;
    private String status;
}
