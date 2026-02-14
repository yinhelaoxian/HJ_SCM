package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 智能补货建议DTO
 */
@Data
@Builder
public class ReplenishmentSuggestion {
    private String materialId;
    private int currentStock;
    private int optimalQty;
    private int safetyStock;
    private int economicOrderQty;
    private List<ReplenishmentOption> options;
    private LocalDateTime recommendedDate;
    private double confidence;
    private String reasoning;
    
    @Data
    @Builder
    public static class ReplenishmentOption {
        private String name;
        private int qty;
        private double cost;
        private String risk;
    }
}
