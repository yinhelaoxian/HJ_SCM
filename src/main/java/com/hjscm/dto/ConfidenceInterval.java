package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 置信区间DTO
 */
@Data
@Builder
public class ConfidenceInterval {
    private Integer week;
    private Double lower;
    private Double upper;
    private Double confidenceLevel;
}
