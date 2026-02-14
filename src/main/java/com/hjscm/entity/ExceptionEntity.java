package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 异常实体
 */
@Entity
@Table(name = "exceptions")
@Data
public class ExceptionEntity {
    
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "type", nullable = false, length = 20)
    private String type;  // SHORTAGE/DELAY/QUALITY/CAPACITY
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "material_id", length = 50)
    private String materialId;
    
    @Column(name = "material_name", length = 200)
    private String materialName;
    
    @Column(name = "quantity")
    private Double quantity;
    
    @Column(name = "amount", precision = 18, scale = 2)
    private Double amount;
    
    @Column(name = "supplier_id", length = 50)
    private String supplierId;
    
    @Column(name = "supplier_name", length = 200)
    private String supplierName;
    
    @Column(name = "customer_level", length = 10)
    private String customerLevel;
    
    @Column(name = "status", length = 20)
    private String status;  // OPEN/PROCESSING/ESCALATED/RESOLVED
    
    @Column(name = "priority_score")
    private Double priorityScore;
    
    @Column(name = "priority_level", length = 20)
    private String priorityLevel;  // CRITICAL/HIGH/MEDIUM/LOW
    
    @Column(name = "sla_deadline")
    private LocalDateTime slaDeadline;
    
    @Column(name = "assigned_to", length = 36)
    private String assignedTo;
    
    @Column(name = "action_taken", length = 500)
    private String actionTaken;
    
    @Column(name = "remark", length = 500)
    private String remark;
    
    @Column(name = "escalate_reason", length = 500)
    private String escalateReason;
    
    @Column(name = "escalate_to", length = 36)
    private String escalateTo;
    
    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
    }
}
