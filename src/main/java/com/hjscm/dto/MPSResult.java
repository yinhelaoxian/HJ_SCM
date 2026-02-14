package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * MPS结果DTO
 */
@Data
@Builder
public class MPSResult {
    private String productId;
    private List<WeeklyPlan> weeklyPlans;
    private GanttChartData ganttData;
    private Map<Integer, Capacity> capacities;
    private double utilization;
    private List<Conflict> conflicts;
    private Date generatedAt;
}
