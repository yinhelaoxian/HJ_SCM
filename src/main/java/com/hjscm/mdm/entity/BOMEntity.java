package com.hjscm.mdm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * BOM主数据实体
 */
@Entity
@Table(name = "mm_bom")
@Data
public class BOMEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bom_id", unique = true, nullable = false, length = 50)
    private String bomId;            // BOM编码
    
    @Column(name = "bom_name", nullable = false, length = 200)
    private String bomName;          // BOM名称
    
    @Column(name = "material", nullable = false, length = 50)
    private String material;         // 父级物料编码
    
    @Column(name = "bom_usage", precision = 15, scale = 5)
    private java.math.BigDecimal bomUsage;  // 用量
    
    @Column(name = "bom_unit", length = 20)
    private String bomUnit;          // 单位
    
    @Column(name = "bom_level", nullable = false)
    private Integer bomLevel;        // BOM层级
    
    @Column(name = "validity_start")
    private LocalDateTime validityStart;  // 生效开始日期
    
    @Column(name = "validity_end")
    private LocalDateTime validityEnd;    // 生效结束日期
    
    @Column(name = "alternative_group", length = 50)
    private String alternativeGroup; // 替代组
    
    @Column(name = "status", nullable = false, length = 10)
    private String status;           // ACTIVE/INACTIVE
    
    @Column(name = "created_by", length = 50)
    private String createdBy;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_by", length = 50)
    private String updatedBy;
    
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
    
    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }
}
