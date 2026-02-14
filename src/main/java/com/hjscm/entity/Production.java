package com.hjscm.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 生产工单
 */
@Entity
@Table(name = "production_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String orderCode;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    private LocalDate planStartDate;
    private LocalDate planEndDate;
    
    private LocalDate actualStartDate;
    private LocalDate actualEndDate;
    
    private BigDecimal completedQty;
    private BigDecimal issuedQty;
    
    @Column(nullable = false)
    private String status; // PENDING / IN_PROGRESS / COMPLETED / CANCELLED / PARTIALLY_COMPLETED
    
    @Column(nullable = false)
    private String plantCode;
    
    private String workstationCode;
    
    // Trace ID 关联
    private String mrpTraceId;
    private String sourceMoId;
    private String traceId;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * 生产投料记录
 */
@Entity
@Table(name = "production_issues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String orderId;
    
    @Column(nullable = false)
    private String materialCode;
    
    @Column(nullable = false)
    private BigDecimal issueQty;
    
    private String batchNo;
    private String workstationCode;
    
    private LocalDateTime issuedAt;
    private String traceId;
}

/**
 * 生产完工记录
 */
@Entity
@Table(name = "production_completions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionCompletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String orderId;
    
    @Column(nullable = false)
    private BigDecimal completedQty;
    
    private LocalDate completedDate;
    private String qualityStatus;
    private String batchNo;
    
    private LocalDateTime createdAt;
    private String traceId;
}
