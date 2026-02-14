package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * MRP采购建议DTO
 */
@Data
@Builder
public class MRPSuggestion {
    // 基础信息
    private String materialId;
    private Double netRequirement;         // 净需求
    private Double suggestedQuantity;     // 建议数量
    
    // 计划信息
    private LocalDate suggestedDate;     // 建议交期
    private String alternativeSupplierId; // 替代供应商
    
    // AI增强
    private Double confidence;           // 置信度
    private List<String> reasons;       // 建议原因
    
    // 医养追溯
    private Boolean medicalRequired;     // 是否医养物料
    private Boolean batchTrackingRequired; // 是否需要批次追踪
}
