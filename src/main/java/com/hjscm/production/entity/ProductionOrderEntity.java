package com.hjscm.production.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 生产订单实体
 */
@Entity
@Table(name = "pr_production_order")
@Data
public class ProductionOrderEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "po_id", unique = true, nullable = false, length = 50)
    private String poId;           // 生产订单号
    
    @Column(name = "order_no", nullable = false, length = 50)
    private String orderNo;       // 订单编号
    
    @Column(name = "product", nullable = false, length = 50)
    private String product;       // 产品编码
    
    @Column(name = "product_name", length = 200)
    private String productName;   // 产品名称
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;      // 计划数量
    
    @Column(name = "unit", nullable = false, length = 20)
    private String unit;          // 单位
    
    // 关联
    @Column(name = "sales_order", length = 50)
    private String salesOrder;    // 销售订单号(面向订单生产)
    
    @Column(name = "bom_id", length = 50)
    private String bomId;         // BOM
    
    @Column(name = "routing_id", length = 50)
    private String routingId;      // 工艺路线
    
    // 状态
    @Column(name = "status", nullable = false, length = 20)
    private String status;        // CREATED/RELEASED/IN_PROGRESS/COMPLETED/CLOSED/CANCELLED
    
    // 日期
    @Column(name = "planned_start")
    private LocalDateTime plannedStart;
    
    @Column(name = "planned_end")
    private LocalDateTime plannedEnd;
    
    @Column(name = "actual_start")
    private LocalDateTime actualStart;
    
    @Column(name = "actual_end")
    private LocalDateTime actualEnd;
    
    // 优先级
    @Column(name = "priority")
    private Integer priority;     // 优先级 1-5
    
    // 备注
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_by", length = 50)
    private String createdBy;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        if (status == null) {
            status = "CREATED";
        }
        if (priority == null) {
            priority = 3;
        }
    }
}
