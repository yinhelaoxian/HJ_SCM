package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * 异常项DTO
 */
@Data
@Builder
public class AnomalyItem {
    private LocalDate date;
    private String type;  // HIGH_SPIKE/LOW_SPIKE/TREND_CHANGE
    private Double severity;  // 0-1
    private String description;
}
