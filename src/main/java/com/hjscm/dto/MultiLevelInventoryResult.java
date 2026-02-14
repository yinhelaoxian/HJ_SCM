package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 多级库存结果DTO
 */
@Data
@Builder
public class MultiLevelInventoryResult {
    private Map<String, InventoryLevel> inventoryLevels;
    private long queryTime;
}
