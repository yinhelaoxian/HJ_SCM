package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 异常创建请求
 */
@Data
@Builder
public class ExceptionCreateRequest {
    private String type;
    private String title;
    private String materialId;
    private String materialName;
    private Double quantity;
    private Double amount;
    private String supplierId;
    private String supplierName;
    private String customerLevel;
    private String createdBy;
}
