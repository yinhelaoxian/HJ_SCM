package com.hjscm.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * BOM 结构
 */
@Entity
@Table(name = "bom_lines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BomLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String parentItem;
    
    @Column(nullable = false)
    private String childItem;
    
    @Column(nullable = false)
    private BigDecimal usagePerParent; // 单位用量
    
    private BigDecimal yieldRate; // 产出率
    private BigDecimal lossRate; // 损耗率
    
    private Integer leadTime; // 提前期
    private Integer validDays; // 有效期
    
    @Column(nullable = false)
    private Boolean active;
    
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    
    private LocalDateTime createdAt;
}

/**
 * MRP 约束配置
 */
@Entity
@Table(name = "mrp_constraints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MrpConstraint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    private Integer moq; // 最小订购量
    private Integer batchSize; // 批量大小
    
    private Integer leadTime; // 采购提前期
    private BigDecimal lotSize; // 批量
    
    private String preferredSupplierId;
    private String alternativeMaterialId;
    
    private Integer safetyLeadTime; // 安全提前期
    
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * MRP 预留
 */
@Entity
@Table(name = "mrp_reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MrpReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private LocalDate reservationDate;
    private LocalDate expirationDate;
    
    private String sourceType; // MPS/MRP/MANUAL
    private String sourceId;
    
    private String traceId;
    
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}

/**
 * 安全库存配置
 */
@Entity
@Table(name = "safety_stock_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafetyStockConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private String plantCode;
    
    private BigDecimal safetyStockQty;
    private BigDecimal minStockQty;
    private BigDecimal maxStockQty;
    
    private Double serviceLevel;
    private Integer leadTimeDays;
    private Double demandStdDev;
    
    private String abcClass;
    private String xyzClass;
    
    private String replenishmentType;
    private Integer reviewPeriodDays;
    
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * 物料日需求
 */
@Entity
@Table(name = "daily_demand")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyDemand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private LocalDate demandDate;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private String sourceType; // ORDER/FORECAST
    private String sourceId;
    
    private LocalDateTime createdAt;
}

/**
 * 物料月需求
 */
@Entity
@Table(name = "monthly_demand")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyDemand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false)
    private Integer month;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private BigDecimal unitPrice;
    
    private LocalDateTime createdAt;
}
