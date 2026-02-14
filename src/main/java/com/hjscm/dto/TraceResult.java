package com.hjscm.dto;

import com.hjscm.entity.TraceRelation;
import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * Trace追溯结果DTO
 */
@Data
@Builder
public class TraceResult {
    private List<TraceRelation> traceChain;  // 追溯链路
    private boolean complete;               // 是否完整
    private String breakagePoint;           // 断点位置
    private boolean medicalSensitive;       // 医养敏感
    private List<String> warnings;          // 警告信息
    
    public static TraceResult success(List<TraceRelation> chain) {
        return TraceResult.builder()
            .traceChain(chain)
            .complete(true)
            .build();
    }
    
    public static TraceResult incomplete(List<Chain, String breakage) {
        return TraceResult.builder()
            .traceChain(chain)
            .complete(false)
            .breakagePoint(breakage)
            .warnings(List.of("追溯链路中断"))
            .build();
    }
}
