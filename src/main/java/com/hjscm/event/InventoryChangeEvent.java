package com.hjscm.event;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存变更事件
 */
@Data
@Builder
public class InventoryChangeEvent {
    private String materialCode;
    private String plantCode;
    private BigDecimal changeQty;
    private String changeType; // GR/GI/ADJUST
    private BigDecimal afterQty;
    private String traceId;
    private LocalDateTime occurredAt;
}
