package com.hjscm.mdm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 供应商主数据实体
 */
@Entity
@Table(name = "mm_supplier")
@Data
public class SupplierEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "supplier_id", unique = true, nullable = false, length = 50)
    private String supplierId;      // 供应商编码
    
    @Column(name = "supplier_name", nullable = false, length = 200)
    private String supplierName;    // 供应商名称
    
    @Column(name = "supplier_name_en", length = 200)
    private String supplierNameEn;  // 英文名称
    
    @Column(name = "supplier_type", length = 50)
    private String supplierType;    // 供应商类型
    
    @Column(name = "category", length = 50)
    private String category;       // 供应品类
    
    @Column(name = "tier_level")
    private Integer tierLevel;     // 分级(1/2/3)
    
    // 联系信息
    @Column(name = "contact_person", length = 100)
    private String contactPerson;  // 联系人
    
    @Column(name = "phone", length = 50)
    private String phone;          // 电话
    
    @Column(name = "email", length = 100)
    private String email;          // 邮箱
    
    @Column(name = "address", length = 500)
    private String address;        // 地址
    
    // 资质信息
    @Column(name = "iso_certified")
    private Boolean isoCertified;  // ISO认证
    
    @Column(name = "quality_rating")
    private java.math.BigDecimal qualityRating;  // 质量评分
    
    @Column(name = "delivery_rating")
    private java.math.BigDecimal deliveryRating;  // 交付评分
    
    @Column(name = "price_rating")
    private java.math.BigDecimal priceRating;  // 价格评分
    
    // 银行信息
    @Column(name = "bank_name", length = 200)
    private String bankName;      // 银行名称
    
    @Column(name = "bank_account", length = 100)
    private String bankAccount;   // 银行账号
    
    // 状态
    @Column(name = "status", nullable = false, length = 10)
    private String status;       // ACTIVE/INACTIVE/BLOCKED
    
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
