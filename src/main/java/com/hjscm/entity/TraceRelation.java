package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Trace关系实体 - Single Source of Truth
 */
@Entity
@Table(name = "trace_relations")
@Data
public class TraceRelation {
    
    @Id
    @Column(name = "trace_id", length = 36)
    private String traceId;
    
    @Column(name = "document_type", nullable = false, length = 10)
    private String documentType;
    
    @Column(name = "document_id", nullable = false, length = 50)
    private String documentId;
    
    @Column(name = "parent_trace_id", length = 36)
    private String parentTraceId;
    
    @Column(name = "child_trace_ids", columnDefinition = "TEXT")
    private String childTraceIds;  // JSON存储
    
    @Column(name = "relation_type", length = 20)
    private String relationType;  // ROOT/DERIVED_FROM/TRIGGERED_BY
    
    @Column(name = "sensitive_flag")
    private Boolean sensitiveFlag;  // 医养敏感标记
    
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
