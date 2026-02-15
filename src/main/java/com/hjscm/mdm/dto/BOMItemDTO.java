package com.hjscm.mdm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

/**
 * BOM子件DTO
 */
@Data
public class BOMItemDTO {
    
    private String componentMaterial;
    
    @NotBlank(message = "子件用量不能为空")
    private BigDecimal componentQty;
    
    private String operationId;
    private String workCenter;
    
    private BigDecimal scrapAddRate;
    private Boolean isPhantom;
    private Boolean isSubcontract;
}
