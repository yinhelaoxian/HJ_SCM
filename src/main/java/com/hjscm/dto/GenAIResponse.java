package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * GenAI请求DTO
 */
@Data
public class GenAIRequest {
    private String query;       // 用户查询
    private String context;     // 业务上下文
    private String userId;      // 用户ID
    private String language;    // 语言
}

/**
 * GenAI响应DTO
 */
@Data
@Builder
public class GenAIResponse {
    private boolean success;
    private String errorCode;
    private String errorMessage;
    
    // 意图
    private String intent;
    
    // 数据
    private Object data;
    
    // 回答
    private String answer;
    
    // 置信度
    private double confidence;
    private List<String> confidenceFactors;
    
    // 建议
    private List<String> suggestions;
    
    // 影响因素
    private List<String> factors;
    
    public static GenAIResponse success(String intent, Object data, String answer,
            double confidence, List<String> factors, List<String> suggestions) {
        return GenAIResponse.builder()
            .success(true)
            .intent(intent)
            .data(data)
            .answer(answer)
            .confidence(confidence)
            .factors(factors)
            .suggestions(suggestions)
            .build();
    }
    
    public static GenAIResponse error(String code, String message) {
        return GenAIResponse.builder()
            .success(false)
            .errorCode(code)
            .errorMessage(message)
            .build();
    }
}
