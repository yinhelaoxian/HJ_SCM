package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * MRP约束配置实体
 */
@Entity
@Table(name = "mrp_constraints")
@Data
public class MRPConstraint {
    
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "material_id", nullable = false, unique = true, length = 50)
    private String materialId;
    
    // MOQ约束
    @Column(name = "moq")
    private Integer moq;
    
    // 批量约束
    @Column(name = "batch_size")
    private Integer batchSize;
    
    // 交期约束
    @Column(name = "lead_time")
    private Integer leadTime;
    
    // 包装单位
    @Column(name = "pack_unit")
    private Integer packUnit;
    
    // 首选供应商
    @Column(name = "preferred_supplier_id", length = 50)
    private String preferredSupplierId;
    
    // 替代物料
    @Column(name = "alternative_material_id", length = 50)
    private String alternativeMaterialId;
    
    // 医养追溯要求
    @Column(name = "batch_tracking_required")
    private Boolean batchTrackingRequired;
    
    @Column(name = "medical_grade")
    private Boolean medicalGrade;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
