package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 供应商实体
 */
@Entity
@Table(name = "suppliers")
@Data
public class SupplierEntity {
    
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "level", length = 10)
    private String level;  // A/B/C
    
    @Column(name = "password_hash", length = 255)
    private String passwordHash;
    
    @Column(name = "contact_name", length = 100)
    private String contactName;
    
    @Column(name = "contact_phone", length = 50)
    private String contactPhone;
    
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "status", length = 20)
    private String status;  // ACTIVE/SUSPENDED/BLOCKED
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
        if (level == null) level = "C";
    }
}
