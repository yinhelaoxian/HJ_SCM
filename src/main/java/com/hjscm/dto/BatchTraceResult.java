package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 批次追踪结果DTO
 */
@Data
@Builder
public class BatchTraceResult {
    private boolean success;
    private String message;
    private String batchNumber;
    private List<TraceNode> traceNodes;
    
    @Data
    @Builder
    public static class TraceNode {
        private String type;      // 单据类型
        private String id;        // 单据ID
        private Object date;      // 日期
        private BigDecimal quantity;  // 数量
    }
}
