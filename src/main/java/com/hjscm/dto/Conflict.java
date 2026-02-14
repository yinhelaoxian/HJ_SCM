package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * 冲突DTO
 */
@Data
@Builder
public class Conflict {
    private Integer week;
    private String type;
    private String severity;
    private String message;
    private List<String> suggestions;
}
