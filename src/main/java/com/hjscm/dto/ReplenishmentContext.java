package com.hjscm.dto;

import lombok.Data;

/**
 * 补货上下文DTO
 */
@Data
public class ReplenishmentContext {
    private String materialId;
    private int currentStock;
    private double averageDailyDemand;
    private double annualDemand;
    private double leadTimeDays;
    private double demandStdDev;
    private double serviceLevel;
    private double orderingCost;
    private double unitCost;
    private double holdingRate;
    private double supplierMinOrder;
    private int historicalDataPoints;
}
