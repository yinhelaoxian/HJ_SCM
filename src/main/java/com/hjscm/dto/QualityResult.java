package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * 质量检查结果DTO
 */
@Data
@Builder
public class QualityResult {
    private String entityType;
    private String entityId;
    private List<QualityIssue> issues;
    private double score;
    private LocalDateTime checkTime;
    
    @Data
    @Builder
    public static class QualityIssue {
        private String type;        // COMPLETENESS/CONSISTENCY/ACCURACY
        private String field;
        private String message;
        private String severity;     // CRITICAL/MAJOR/MINOR
        private String suggestion;
    }
}
