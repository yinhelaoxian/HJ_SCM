package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * 周计划DTO
 */
@Data
@Builder
public class WeeklyPlan {
    private Integer week;
    private LocalDate date;
    private Integer forecastQuantity;
    private Integer planQuantity;
    private Double capacityHours;
    private Double utilization;
    private String status;
}
