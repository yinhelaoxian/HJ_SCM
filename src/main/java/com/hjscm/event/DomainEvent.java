package com.hjscm.event;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 领域事件 - Event-Driven Architecture
 */
@Data
public class DomainEvent {
    
    private String eventId;
    private String eventType;        // 事件类型
    private String documentType;      // 单据类型
    private String documentId;        // 单据ID
    private String oldStatus;         // 原状态
    private String newStatus;         // 新状态
    private String userId;           // 操作用户
    private LocalDateTime timestamp; // 时间戳
    private String payload;          // 附加数据（JSON）
    
    public static DomainEvent create(
            String eventType,
            String documentType,
            String documentId,
            String oldStatus,
            String newStatus,
            String userId) {
        
        DomainEvent event = new DomainEvent();
        event.setEventId(UUID.randomUUID().toString());
        event.setEventType(eventType);
        event.setDocumentType(documentType);
        event.setDocumentId(documentId);
        event.setOldStatus(oldStatus);
        event.setNewStatus(newStatus);
        event.setUserId(userId);
        event.setTimestamp(LocalDateTime.now());
        
        return event;
    }
}
