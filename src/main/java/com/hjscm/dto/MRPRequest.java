package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * MRP计算请求DTO
 */
@Data
@Builder
public class MRPRequest {
    // 需求来源
    private String sourceSoId;              // 来源销售订单ID
    private Map<String, Double> demandForecast;  // 预测需求
    
    // 约束条件
    private List<String> materialIds;      // 物料ID列表
    private LocalDate planningHorizon;       // 计划周期
    private Boolean considerConstraint;      // 是否考虑约束
    
    // 业务参数
    private String planningUnit;            // 计划单元（工厂/公司）
    private String currency;               // 币种
}
