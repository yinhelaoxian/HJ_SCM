package com.hjscm.mdm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * BOM DTO
 */
@Data
public class BOMDTO {
    
    private String bomId;
    
    @NotBlank(message = "BOM名称不能为空")
    @Size(max = 200, message = "BOM名称长度不能超过200")
    private String bomName;
    
    @NotBlank(message = "父级物料不能为空")
    private String material;
    
    private java.math.BigDecimal bomUsage;
    private String bomUnit;
    
    @NotBlank(message = "BOM层级不能为空")
    private Integer bomLevel;
    
    private LocalDateTime validityStart;
    private LocalDateTime validityEnd;
    private String alternativeGroup;
    
    private List<BOMItemDTO> items;
}
