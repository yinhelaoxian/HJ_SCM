package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 产能约束DTO
 */
@Data
@Builder
public class Capacity {
    private Integer week;
    private Double availableHours;
    private Double plannedHours;
    private Double efficiency;
}
