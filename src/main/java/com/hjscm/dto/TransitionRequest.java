package com.hjscm.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 状态转换请求DTO
 */
@Data
public class TransitionRequest {
    private String documentType;    // 单据类型 (SO/PO/MO/GR/DN)
    private String documentId;      // 单据ID
    private String eventCode;       // 事件代码
    private String userId;         // 操作用户ID
    private String remark;         // 备注
    private LocalDateTime timestamp; // 时间戳
}
