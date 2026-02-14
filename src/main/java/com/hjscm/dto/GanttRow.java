package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 甘特图行DTO
 */
@Data
@Builder
public class GanttRow {
    private String workCenter;
    private List<GanttItem> items;
}
