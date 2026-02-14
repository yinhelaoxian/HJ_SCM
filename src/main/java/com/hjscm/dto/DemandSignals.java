package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 需求感知结果DTO
 */
@Data
@Builder
public class DemandSignals {
    private String materialId;
    private List<DemandSignal> signals;
    private double aggregatedSignal;
    private DemandDrift drift;
    private String recommendation;
    private LocalDateTime detectedAt;
    
    @Data
    @Builder
    public static class DemandSignal {
        private String type;
        private String source;
        private String description;
        private double value;
        private double weight;
        private double strength;
        private String level;
    }
    
    @Data
    @Builder
    public static class DemandDrift {
        private String materialId;
        private double baseline;
        private double current;
        private double driftPercent;
        private boolean detected;
        private String direction;
        private String magnitude;
    }
}
