package com.hjscm.wms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 收货单实体
 */
@Entity
@Table(name = "wm_gr_header")
@Data
public class GoodsReceiptEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "gr_id", unique = true, nullable = false, length = 50)
    private String grId;           // 收货单号
    
    @Column(name = "po_number", nullable = false, length = 50)
    private String poNumber;       // 采购订单号
    
    @Column(name = "supplier", nullable = false, length = 100)
    private String supplier;       // 供应商
    
    @Column(name = "expected_date")
    private LocalDateTime expectedDate;  // 预计到货日期
    
    @Column(name = "actual_date")
    private LocalDateTime actualDate;    // 实际到货日期
    
    // 状态
    @Column(name = "status", nullable = false, length = 20)
    private String status;         // CREATED/RECEIVING/CHECKED/PUTAWAY/COMPLETED
    
    @Column(name = "received_by", length = 50)
    private String receivedBy;      // 收货人
    
    @Column(name = "inspection_id", length = 50)
    private String inspectionId;   // 关联检验单
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;          // 备注
    
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
    }
}
