package com.hjscm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 物料需求实体
 * 
 * 对应业务表：material_demand
 * 
 * 功能：
 * - 记录物料需求信息
 * - 关联 MPS 计划
 */
@Entity
@Table(name = "material_demand")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDemandEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "demand_code", length = 50, nullable = false)
    private String demandCode;

    @Column(name = "material_code", length = 50, nullable = false)
    private String materialCode;

    @Column(name = "material_name", length = 200)
    private String materialName;

    @Column(name = "plant_code", length = 20, nullable = false)
    private String plantCode;

    @Column(name = "demand_date", nullable = false)
    private LocalDate demandDate;

    @Column(name = "required_quantity", precision = 18, scale = 4, nullable = false)
    private BigDecimal requiredQuantity;

    @Column(name = "fulfilled_quantity", precision = 18, scale = 4)
    private BigDecimal fulfilledQuantity;

    @Column(name = "unit_code", length = 10)
    private String unitCode;

    @Column(name = "demand_type", length = 20)
    private String demandType;  // MPS/订单/预测

    @Column(name = "source_id", length = 50)
    private String sourceId;  // 来源单据ID

    @Column(name = "priority", length = 10)
    private String priority;

    @Column(name = "status", length = 20)
    private String status;  // PENDING/FULFILLED/CANCELLED

    @Column(name = "remark", length = 500)
    private String remark;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
