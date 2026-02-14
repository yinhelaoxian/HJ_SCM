package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * 预测项DTO
 */
@Data
@Builder
public class ForecastItem {
    private LocalDate date;
    private Integer week;
    private Integer quantity;
    private String method;
}
