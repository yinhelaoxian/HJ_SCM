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
 * 在途订单实体
 * 
 * 对应业务表：in_transit_order
 * 
 * 功能：
 * - 记录采购在途订单
 * - 跟踪预计到货时间
 * - 支持 ATP 计算
 */
@Entity
@Table(name = "in_transit_order")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InTransitOrderEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "order_code", length = 50, nullable = false)
    private String orderCode;

    @Column(name = "material_code", length = 50, nullable = false)
    private String materialCode;

    @Column(name = "material_name", length = 200)
    private String materialName;

    @Column(name = "plant_code", length = 20, nullable = false)
    private String plantCode;

    @Column(name = "supplier_code", length = 50)
    private String supplierCode;

    @Column(name = "order_quantity", precision = 18, scale = 4, nullable = false)
    private BigDecimal orderQuantity;

    @Column(name = "received_quantity", precision = 18, scale = 4)
    private BigDecimal receivedQuantity;

    @Column(name = "unit_code", length = 10)
    private String unitCode;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "estimated_arrival_date")
    private LocalDate estimatedArrivalDate;

    @Column(name = "actual_receipt_date")
    private LocalDate actualReceiptDate;

    @Column(name = "warehouse_code", length = 20)
    private String warehouseCode;

    @Column(name = "status", length = 20)
    private String status;  // PENDING/IN_TRANSIT/RECEIVED/CANCELLED

    @Column(name = "purchase_order_id", length = 50)
    private String purchaseOrderId;

    @Column(name = "remark", length = 500)
    private String remark;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
