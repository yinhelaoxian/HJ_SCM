package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * 质量检查日志实体
 */
@Entity
@Table(name = "quality_logs")
@Data
public class QualityCheckLog {
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "entity_type", length = 50)
    private String entityType;
    
    @Column(name = "entity_id", length = 36)
    private String entityId;
    
    @Column(name = "check_type", length = 50)
    private String checkType;
    
    @Column(name = "issue_type", length = 50)
    private String issueType;
    
    @Column(name = "issue_message", length = 500)
    private String issueMessage;
    
    @Column(name = "severity")
    private String severity;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
