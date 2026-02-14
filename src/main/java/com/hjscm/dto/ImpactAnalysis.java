package com.hjscm.dto;

import com.hjscm.entity.TraceRelation;
import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * 变更影响分析结果DTO
 */
@Data
@Builder
public class ImpactAnalysis {
    private String sourceDocument;           // 源单据
    private String sourceTraceId;           // 源Trace ID
    private List<TraceRelation> affectedBy; // 受影响的上游
    private List<TraceRelation> affects;    // 影响的下游
    private String impactLevel;             // 影响级别
    private boolean medicalImpact;          // 医养影响
    private List<String> recommendations;   // 建议
    private String message;                 // 消息
    
    public static ImpactAnalysis noImpact() {
        return ImpactAnalysis.builder()
            .impactLevel("NONE")
            .message("无影响")
            .build();
    }
    
    public static ImpactAnalysis unknown(String document) {
        return ImpactAnalysis.builder()
            .sourceDocument(document)
            .impactLevel("UNKNOWN")
            .message("未找到Trace ID")
            .build();
    }
}
