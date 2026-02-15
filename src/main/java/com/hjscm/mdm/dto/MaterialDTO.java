package com.hjscm.mdm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 物料主数据DTO
 */
@Data
public class MaterialDTO {
    
    private String materialId;
    
    @NotBlank(message = "物料名称不能为空")
    @Size(max = 200, message = "物料名称长度不能超过200")
    private String materialName;
    
    @Size(max = 200, message = "英文名称长度不能超过200")
    private String materialNameEn;
    
    @NotBlank(message = "物料组不能为空")
    @Size(max = 50, message = "物料组长度不能超过50")
    private String materialGroup;
    
    @NotBlank(message = "物料类型不能为空")
    private String materialType;  // ROH/HALB/FERT
    
    @NotBlank(message = "基本计量单位不能为空")
    private String baseUnit;
    
    // 采购信息
    private String defaultSupplier;
    private String procurementType;  // F/K
    private Integer moq;              // 最小订单量
    private Integer leadTime;         // 采购提前期(天)
    private java.math.BigDecimal priceMin;
    private java.math.BigDecimal priceMax;
    
    // 库存信息
    private String storageLocation;
    private String abcClass;          // A/B/C
    private String xyzClass;          // X/Y/Z
    private java.math.BigDecimal safetyStock;
    private java.math.BigDecimal reorderPoint;
    
    // 生产信息
    private String bomId;
    private String routingId;
    private Integer productionBatch;
    private java.math.BigDecimal scrapRate;
    
    // 质量信息
    private String inspectionType;
    private Integer shelfLife;
    private Boolean isSerialNumber;
    private Boolean isBatchManage;
}
