package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * MRP计算结果DTO
 */
@Data
@Builder
public class MRPResult {
    // 计算结果
    private Map<String, MRPSuggestion> suggestions;  // 采购建议
    
    // 计算元数据
    private long calculationTimeMs;         // 计算耗时
    private LocalDate planningHorizon;     // 计划周期
    
    // 消息
    private List<String> warnings;         // 警告
    private List<String> conflicts;        // 冲突
    
    // 状态
    private boolean success;
    private String errorMessage;
}
