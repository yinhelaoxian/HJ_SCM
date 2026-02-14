package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 库存批次实体 - 批次追溯核心
 */
@Entity
@Table(name = "inventory_batches")
@Data
public class InventoryBatch {
    
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;
    
    @Column(name = "material_id", nullable = false, length = 50)
    private String materialId;
    
    @Column(name = "warehouse_id", nullable = false, length = 50)
    private String warehouseId;
    
    @Column(name = "location_id", length = 50)
    private String locationId;
    
    @Column(name = "quantity", nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;
    
    @Column(name = "unit_code", length = 20)
    private String unitCode;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Column(name = "manufacture_date")
    private LocalDate manufactureDate;
    
    @Column(name = "trace_id", length = 36)
    private String traceId;
    
    @Column(name = "status", length = 20)
    private String status;  // AVAILABLE/RESERVED/BLOCKED/EXPIRED
    
    @Column(name = "medical_grade")
    private Boolean medicalGrade;  // 医养等级标记
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
