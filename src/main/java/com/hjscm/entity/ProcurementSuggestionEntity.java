package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购建议实体
 * 
 * 对应业务表：procurement_suggestion
 * 
 * 功能：
 * - 记录 MRP 运算后的采购建议
 * - 支持采购员下单决策
 * - 跟踪建议状态
 */
@Entity
@Table(name = "procurement_suggestion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementSuggestionEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "suggestion_code", length = 50, nullable = false)
    private String suggestionCode;

    @Column(name = "material_code", length = 50, nullable = false)
    private String materialCode;

    @Column(name = "material_name", length = 200)
    private String materialName;

    @Column(name = "plant_code", length = 20, nullable = false)
    private String plantCode;

    @Column(name = "suggested_quantity", precision = 18, scale = 4, nullable = false)
    private BigDecimal suggestedQuantity;

    @Column(name = "unit_code", length = 10)
    private String unitCode;

    @Column(name = "suggested_date")
    private LocalDate suggestedDate;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Column(name = "priority", length = 10)
    private String priority;

    @Column(name = "supplier_code", length = 50)
    private String supplierCode;

    @Column(name = "supplier_name", length = 200)
    private String supplierName;

    @Column(name = "unit_price", precision = 18, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "moq", length = 20)
    private String moq;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Column(name = "status", length = 20)
    private String status;  // PENDING/APPROVED/REJECTED/ORDERED/CANCELLED

    @Column(name = "mrp_run_id", length = 50)
    private String mrpRunId;

    @Column(name = "trace_id", length = 50)
    private String traceId;

    @Column(name = "remark", length = 500)
    private String remark;

    @Column(name = "approved_by", length = 50)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "ordered_by", length = 50)
    private String orderedBy;

    @Column(name = "ordered_at")
    private LocalDateTime orderedAt;

    @Column(name = "purchase_order_id", length = 50)
    private String purchaseOrderId;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
