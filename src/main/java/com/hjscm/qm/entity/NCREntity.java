package com.hjscm.qm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * NCR不合格品处理实体
 */
@Entity
@Table(name = "qm_ncr")
@Data
public class NCREntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ncr_id", unique = true, nullable = false, length = 50)
    private String ncrId;           // NCR单号
    
    @Column(name = "source", nullable = false, length = 20)
    private String source;          // 来源: IQC/OQC/IPQC/CUSTOMER
    
    @Column(name = "material", nullable = false, length = 50)
    private String material;        // 物料
    
    @Column(name = "batch_no", length = 50)
    private String batchNo;        // 批次号
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;      // 数量
    
    // 问题描述
    @Column(name = "problem_type", length = 100)
    private String problemType;     // 问题类型
    
    @Column(name = "problem_desc", columnDefinition = "TEXT")
    private String problemDesc;    // 问题描述
    
    @Column(name = "severity", length = 20)
    private String severity;       // MAJOR/MINOR/CRITICAL
    
    // 处置决定
    @Column(name = "disposition", length = 20)
    private String disposition;   // RETURN/REWORK/SCRAP/ACCEPT
    
    @Column(name = "disposition_desc", columnDefinition = "TEXT")
    private String dispositionDesc; // 处置说明
    
    // 根本原因
    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;      // 根本原因
    
    @Column(name = "root_cause_category", length = 20)
    private String rootCauseCategory; // MAN/MACHINE/MATERIAL/METHOD/ENVIRONMENT
    
    // CAPA关联
    @Column(name = "capa_id", length = 50)
    private String capaId;        // CAPA关联号
    
    // 关闭信息
    @Column(name = "close_date")
    private LocalDateTime closeDate;
    
    @Column(name = "closed_by", length = 50)
    private String closedBy;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status;         // OPEN/IN_PROGRESS/CLOSED
    
    @Column(name = "created_by", length = 50)
    private String createdBy;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        if (status == null) {
            status = "OPEN";
        }
    }
}
