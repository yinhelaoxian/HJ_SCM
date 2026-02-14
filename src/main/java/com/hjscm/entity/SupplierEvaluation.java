package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * 供应商评价实体
 */
@Entity
@Table(name = "supplier_evaluations")
@Data
public class SupplierEvaluation {
    @Id
    @Column(name = "id", length = 36)
    private String id;
    
    @Column(name = "supplier_id", length = 36)
    private String supplierId;
    
    @Column(name = "period_start")
    private LocalDate periodStart;
    
    @Column(name = "period_end")
    private LocalDate periodEnd;
    
    // 质量指标
    @Column(name = "acceptance_rate")
    private double acceptanceRate;    // 来料合格率
    
    @Column(name = "batch_pass_rate")
    private double batchPassRate;     // 批次合格率
    
    @Column(name = "quality_issues_count")
    private int qualityIssuesCount;   // 质量问题数
    
    // 交付指标
    @Column(name = "on_time_delivery_rate")
    private double onTimeDeliveryRate; // 准时交付率
    
    @Column(name = "avg_lead_time_deviation")
    private double avgLeadTimeDeviation; // 平均交期偏差
    
    // 价格指标
    @Column(name = "price_level")
    private double priceLevel;       // 价格水平
    
    @Column(name = "price_stability")
    private double priceStability;   // 价格稳定性
    
    // 服务指标
    @Column(name = "response_speed")
    private double responseSpeed;    // 响应速度
    
    @Column(name = "cooperation_level")
    private double cooperationLevel; // 配合度
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
