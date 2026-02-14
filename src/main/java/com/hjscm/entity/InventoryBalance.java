package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存余额实体
 */
@Entity
@Table(name = "inventory_balances")
@Data
public class InventoryBalance {
    
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "material_id", nullable = false, length = 50)
    private String materialId;
    
    @Column(name = "warehouse_id", nullable = false, length = 50)
    private String warehouseId;
    
    @Column(name = "quantity", nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;
    
    @Column(name = "reserved_qty", precision = 18, scale = 6)
    private BigDecimal reservedQty;
    
    @Column(name = "available_qty", precision = 18, scale = 6)
    private BigDecimal availableQty;
    
    @Column(name = "trace_id", length = 36)
    private String traceId;
    
    @Column(name = "as_of_date", nullable = false)
    private LocalDateTime asOfDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (availableQty == null) {
            availableQty = (quantity != null ? quantity : BigDecimal.ZERO)
                .subtract(reservedQty != null ? reservedQty : BigDecimal.ZERO);
        }
    }
}
