package com.hjscm.mdm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 物料主数据实体
 */
@Entity
@Table(name = "mm_material")
@Data
public class MaterialEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 基础信息
    @Column(name = "material_id", unique = true, nullable = false, length = 50)
    private String materialId;           // 物料编码
    
    @Column(name = "material_name", nullable = false, length = 200)
    private String materialName;         // 物料名称
    
    @Column(name = "material_name_en", length = 200)
    private String materialNameEn;       // 英文名称
    
    @Column(name = "material_group", nullable = false, length = 50)
    private String materialGroup;       // 物料组
    
    @Column(name = "material_type", nullable = false, length = 10)
    private String materialType;         // ROH/HALB/FERT
    
    @Column(name = "base_unit", nullable = false, length = 20)
    private String baseUnit;            // 基本计量单位
    
    // 采购信息
    @Column(name = "default_supplier", length = 50)
    private String defaultSupplier;      // 默认供应商
    
    @Column(name = "procurement_type", length = 10)
    private String procurementType;     // F/K
    
    @Column(name = "moq")
    private Integer moq;               // 最小订单量
    
    @Column(name = "lead_time")
    private Integer leadTime;          // 采购提前期(天)
    
    @Column(name = "price_min")
    private java.math.BigDecimal priceMin;  // 价格下限
    
    @Column(name = "price_max")
    private java.math.BigDecimal priceMax;  // 价格上限
    
    // 库存信息
    @Column(name = "storage_location", length = 50)
    private String storageLocation;    // 默认存储地点
    
    @Column(name = "abc_class", length = 1)
    private String abcClass;          // A/B/C
    
    @Column(name = "xyz_class", length = 1)
    private String xyzClass;          // X/Y/Z
    
    @Column(name = "safety_stock")
    private java.math.BigDecimal safetyStock;  // 安全库存
    
    @Column(name = "reorder_point")
    private java.math.BigDecimal reorderPoint; // 再订货点
    
    // 生产信息
    @Column(name = "bom_id", length = 50)
    private String bomId;             // 关联BOM
    
    @Column(name = "routing_id", length = 50)
    private String routingId;         // 关联工艺路线
    
    @Column(name = "production_batch")
    private Integer productionBatch;  // 生产批量
    
    @Column(name = "scrap_rate", precision = 5, scale = 4)
    private java.math.BigDecimal scrapRate;  // 损耗率
    
    // 质量信息
    @Column(name = "inspection_type", length = 10)
    private String inspectionType;    // 检验类型
    
    @Column(name = "shelf_life")
    private Integer shelfLife;       // 保质期(天)
    
    @Column(name = "is_serial_number")
    private Boolean isSerialNumber;   // 是否序列号管理
    
    @Column(name = "is_batch_manage")
    private Boolean isBatchManage;    // 是否批次管理
    
    // 状态
    @Column(name = "status", nullable = false, length = 10)
    private String status;           // ACTIVE/INACTIVE
    
    // 审计字段
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
