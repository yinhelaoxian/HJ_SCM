package com.hjscm.wms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 库存实体
 */
@Entity
@Table(name = "wm_inventory")
@Data
public class InventoryEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "material", nullable = false, length = 50)
    private String material;        // 物料编码
    
    @Column(name = "material_name", length = 200)
    private String materialName;   // 物料名称
    
    @Column(name = "storage_location", nullable = false, length = 50)
    private String storageLocation; // 存储地点(工厂/仓库)
    
    @Column(name = "storage_bin", nullable = false, length = 50)
    private String storageBin;    // 库位
    
    @Column(name = "batch_no", nullable = false, length = 50)
    private String batchNo;       // 批次号
    
    @Column(name = "quantity", nullable = false)
    private java.math.BigDecimal quantity;  // 数量
    
    @Column(name = "unit", nullable = false, length = 20)
    private String unit;          // 单位
    
    // 状态
    @Column(name = "quality_status", length = 20)
    private String qualityStatus; // FREE/BLOCKED/QUARANTINE
    
    @Column(name = "stock_type", length = 20)
    private String stockType;     // UNRESTRICTED/IN_TRANSIT/QUALITY
    
    // 序列号(可选)
    @Column(name = "serial_no", length = 50)
    private String serialNo;      // 序列号
    
    // 日期
    @Column(name = "produced_date")
    private LocalDateTime producedDate;  // 生产日期
    
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;    // 有效期
    
    @Column(name = "last_movement_date")
    private LocalDateTime lastMovementDate;  // 最后移动日期
    
    // 成本
    @Column(name = "unit_cost", precision = 15, scale = 4)
    private java.math.BigDecimal unitCost;  // 单位成本
    
    @Column(name = "total_value", precision = 15, scale = 2)
    private java.math.BigDecimal totalValue; // 总价值
    
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
        lastMovementDate = LocalDateTime.now();
        if (qualityStatus == null) {
            qualityStatus = "FREE";
        }
        if (stockType == null) {
            stockType = "UNRESTRICTED";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
        lastMovementDate = LocalDateTime.now();
    }
}
