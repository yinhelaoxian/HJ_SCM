package com.hjscm.qm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * IQC来料检验实体
 */
@Entity
@Table(name = "qm_iqc_header")
@Data
public class IQCInspectionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "inspection_id", unique = true, nullable = false, length = 50)
    private String inspectionId;      // 检验单号
    
    @Column(name = "po_number", nullable = false, length = 50)
    private String poNumber;          // 采购订单号
    
    @Column(name = "supplier", nullable = false, length = 100)
    private String supplier;          // 供应商
    
    @Column(name = "material", nullable = false, length = 50)
    private String material;         // 物料编码
    
    @Column(name = "material_name", length = 200)
    private String materialName;     // 物料名称
    
    @Column(name = "batch_no", nullable = false, length = 50)
    private String batchNo;          // 批次号
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;        // 数量
    
    @Column(name = "inspection_date")
    private LocalDateTime inspectionDate;  // 检验日期
    
    @Column(name = "inspector", length = 50)
    private String inspector;       // 检验员
    
    @Column(name = "inspection_type", length = 20)
    private String inspectionType; // 抽检/全检
    
    @Column(name = "sampling_plan", length = 100)
    private String samplingPlan;    // 抽样方案
    
    // 检验结果
    @Column(name = "overall_result", length = 10)
    private String overallResult;   // PASS/FAIL/HOLD
    
    @Column(name = "pass_qty")
    private Integer passQty;       // 合格数量
    
    @Column(name = "fail_qty")
    private Integer failQty;       // 不合格数量
    
    @Column(name = "hold_qty")
    private Integer holdQty;        // 待处理数量
    
    @Column(name = "ncr_id", length = 50)
    private String ncrId;          // NCR单号
    
    @Column(name = "status", nullable = false, length = 20)
    private String status;         // CREATED/IN_PROGRESS/COMPLETED
    
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
        if (inspectionDate == null) {
            inspectionDate = LocalDateTime.now();
        }
    }
}
