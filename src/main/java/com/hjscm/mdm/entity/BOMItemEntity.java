package com.hjscm.mdm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * BOM子件实体
 */
@Entity
@Table(name = "mm_bom_item")
@Data
public class BOMItemEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bom_id", nullable = false, length = 50)
    private String bomId;            // BOM编码
    
    @Column(name = "component_material", nullable = false, length = 50)
    private String componentMaterial; // 子件物料编码
    
    @Column(name = "component_qty", precision = 15, scale = 5)
    private java.math.BigDecimal componentQty;  // 用量
    
    @Column(name = "operation_id", length = 50)
    private String operationId;      // 工序号
    
    @Column(name = "work_center", length = 50)
    private String workCenter;      // 工作中心
    
    @Column(name = "scrap_add_rate", precision = 8, scale = 6)
    private java.math.BigDecimal scrapAddRate;  // 损耗率
    
    @Column(name = "is_phantom")
    private Boolean isPhantom;       // 虚拟件标识
    
    @Column(name = "is_subcontract")
    private Boolean isSubcontract;  // 外协件标识
    
    @Column(name = "item_sequence")
    private Integer itemSequence;   // 项目序号
    
    @Column(name = "created_by", length = 50)
    private String createdBy;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
