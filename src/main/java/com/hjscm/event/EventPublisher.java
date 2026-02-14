package com.hjscm.event;

import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import java.util.concurrent.CompletableFuture;

/**
 * 事件发布者 - 发布领域事件到Kafka
 */
@Component
public class EventPublisher {

    private static final String DOMAIN_EVENTS_TOPIC = "hjscm-domain-events";
    
    private final KafkaTemplate<String, String> kafkaTemplate;
    
    public EventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    /**
     * 发布领域事件
     */
    public void publish(DomainEvent event) {
        String message = serializeEvent(event);
        
        CompletableFuture<SendResult<String, String>> future = 
            kafkaTemplate.send(
                DOMAIN_EVENTS_TOPIC,
                event.getDocumentId(),
                message
            );
        
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                // 事件发布失败，记录到日志
                System.err.println("事件发布失败: " + event.getEventId());
            } else {
                System.out.println("事件发布成功: " + event.getEventId() 
                    + " -> partition:" + result.getRecordMetadata().partition()
                    + " offset:" + result.getRecordMetadata().offset());
            }
        });
    }
    
    /**
     * 序列化事件为JSON
     */
    private String serializeEvent(DomainEvent event) {
        // 使用Jackson序列化
        return String.format(
            "{\"eventId\":\"%s\",\"eventType\":\"%s\",\"documentType\":\"%s\"," +
            "\"documentId\":\"%s\",\"oldStatus\":\"%s\",\"newStatus\":\"%s\"," +
            "\"userId\":\"%s\",\"timestamp\":\"%s\"}",
            event.getEventId(),
            event.getEventType(),
            event.getDocumentType(),
            event.getDocumentId(),
            event.getOldStatus(),
            event.getNewStatus(),
            event.getUserId(),
            event.getTimestamp().toString()
        );
    }
}
