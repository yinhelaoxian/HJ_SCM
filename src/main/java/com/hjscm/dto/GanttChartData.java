package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 甘特图数据DTO
 */
@Data
@Builder
public class GanttChartData {
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<GanttRow> rows;
}
