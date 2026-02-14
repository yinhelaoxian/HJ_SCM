package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * ATP计算结果DTO
 */
@Data
@Builder
public class ATPResult {
    private String materialId;
    private BigDecimal requestedQty;
    private BigDecimal availableStock;
    private BigDecimal inTransit;
    private BigDecimal committed;
    private BigDecimal atpQuantity;
    private boolean canFulfill;
    private List<String> warnings;
}
