package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * EDI报文DTO
 */
@Data
@Builder
public class EDIMessage {
    private String type;        // 850/855/856/810/820
    private String content;     // 原始报文
    private String direction;   // INBOUND/OUTBOUND
    private LocalDateTime createdAt;
    private String status;      // PENDING/PROCESSED/ERROR
    private String errorMessage;
}
