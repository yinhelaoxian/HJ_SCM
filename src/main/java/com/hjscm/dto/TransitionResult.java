package com.hjscm.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 状态转换结果DTO
 */
@Data
public class TransitionResult {
    private boolean success;
    private String targetStatus;      // 目标状态
    private String errorCode;         // 错误代码
    private String errorMessage;       // 错误消息
    private LocalDateTime timestamp;   // 操作时间
    
    public static TransitionResult success(String targetStatus) {
        TransitionResult result = new TransitionResult();
        result.setSuccess(true);
        result.setTargetStatus(targetStatus);
        result.setTimestamp(LocalDateTime.now());
        return result;
    }
    
    public static TransitionResult error(String code, String message) {
        TransitionResult result = new TransitionResult();
        result.setSuccess(false);
        result.setErrorCode(code);
        result.setErrorMessage(message);
        result.setTimestamp(LocalDateTime.now());
        return result;
    }
}
