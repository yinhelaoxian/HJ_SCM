package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 库存层级DTO
 */
@Data
@Builder
public class InventoryLevel {
    private String materialId;
    private BigDecimal factoryStock;       // 工厂仓
    private BigDecimal inTransitStock;    // 在途
    private BigDecimal consignmentStock;  // 寄售
    private BigDecimal returnStock;       // 退回
    private BigDecimal totalAvailable;     // 合计可用
    
    public BigDecimal getTotalAvailable() {
        return (factoryStock != null ? factoryStock : BigDecimal.ZERO)
            .add(inTransitStock != null ? inTransitStock : BigDecimal.ZERO)
            .add(consignmentStock != null ? consignmentStock : BigDecimal.ZERO)
            .add(returnStock != null ? returnStock : BigDecimal.ZERO);
    }
}
