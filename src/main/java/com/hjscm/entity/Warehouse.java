package com.hjscm.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 库存余额
 */
@Entity
@Table(name = "inventory_balances")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    private String warehouseCode;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private BigDecimal reservedQty; // 预留量
    private BigDecimal safetyStock; // 安全库存
    private BigDecimal inTransitQty; // 在途量
    
    private LocalDate asOfDate;
    private LocalDate oldestBatchDate;
    private Integer batchCount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * 库存交易流水
 */
@Entity
@Table(name = "inventory_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String transType; // GR/GI/ST/ADJUST
    
    @Column(nullable = false, unique = true)
    private String transCode;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    private String warehouseCode;
    private String batchNo;
    
    private BigDecimal transQty; // 变动数量（正/负）
    private BigDecimal beforeQty;
    private BigDecimal afterQty;
    
    private String sourceDocType;
    private String sourceDocId;
    
    private String traceId;
    
    private LocalDateTime transAt;
    private String transBy;
    private String remark;
}

/**
 * 在途订单
 */
@Entity
@Table(name = "in_transit_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InTransitOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    @Column(nullable = false)
    private String orderCode;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private LocalDate orderDate;
    private LocalDate expectedArrivalDate;
    private LocalDate actualArrivalDate;
    
    private String logisticsProvider;
    private String trackingNo;
    
    private String status; // SHIPPED / IN_TRANSIT / ARRIVED
    private String traceId;
    
    private LocalDateTime createdAt;
}
