package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * 甘特图项DTO
 */
@Data
@Builder
public class GanttItem {
    private String name;
    private LocalDate start;
    private LocalDate end;
    private Integer quantity;
    private String status;
}
