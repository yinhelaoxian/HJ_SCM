package com.hjscm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * 采购建议
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementSuggestion {
    private String itemCode;
    private String itemName;
    private BigDecimal suggestedQty;
    private java.time.LocalDate suggestedDate;
    private String supplierCode;
    private String supplierName;
    private BigDecimal estimatedPrice;
    private String urgencyLevel;
    private String reason;
    private String traceId;
    private List<SupplierInfo> alternativeSuppliers;
}

/**
 * 供应商信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class SupplierInfo {
    private String supplierCode;
    private String supplierName;
    private BigDecimal price;
    private Integer leadTime;
    private BigDecimal moq;
    private Double otdRate;
}

/**
 * MRP 运行请求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MrpRunRequest {
    private String runMode;  // FORECAST / ORDER / FULL
    private java.time.LocalDate planFromDate;
    private java.time.LocalDate planToDate;
    private String itemCode;
    private String plantCode;
    private Boolean includeKitCheck;
    private Boolean generateSuggestions;
}

/**
 * MRP 运行响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MrpRunResponse {
    private String runId;
    private String status;
    private Long durationMs;
    private Integer requirementCount;
    private Integer shortageCount;
    private Integer suggestionCount;
    private List<String> warnings;
    private String errorMessage;
    private java.time.LocalDateTime createdAt;
}

/**
 * MRP 物料需求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MrpRequirement {
    private String itemCode;
    private String itemName;
    private BigDecimal requiredQty;
    private String uom;
    private Integer level;
    private String itemCategory;
    private String sourceType;
    private Integer leadTime;
    private BigDecimal safetyStock;
    private String traceId;
}

/**
 * MRP 净需求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MrpNetRequirement {
    private String itemCode;
    private BigDecimal grossRequirement;
    private BigDecimal availableQty;
    private BigDecimal safetyStock;
    private BigDecimal netRequirement;
    private java.time.LocalDate requiredDate;
    private Integer leadTime;
    private String traceId;
}

/**
 * 齐套检查结果
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class KitCheckResult {
    private java.time.LocalDate checkDate;
    private List<KitItem> kitItems;
    private List<KitShortage> shortages;
    private Double overallFillRate;
    
    public void addKitItem(KitItem item) {
        if (kitItems == null) kitItems = new java.util.ArrayList<>();
        kitItems.add(item);
    }
    
    public void addShortage(KitShortage shortage) {
        if (shortages == null) shortages = new java.util.ArrayList<>();
        shortages.add(shortage);
    }
    
    public void calculateOverallFillRate() {
        if (kitItems == null || kitItems.isEmpty()) {
            overallFillRate = 100.0;
            return;
        }
        double total = kitItems.stream().mapToDouble(k -> k.getFillRate() * 100).sum();
        overallFillRate = total / kitItems.size();
    }
}

/**
 * 齐套项
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class KitItem {
    private String itemCode;
    private BigDecimal requiredQty;
    private BigDecimal availableQty;
    private Double fillRate;
}

/**
 * 缺料项
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class KitShortage {
    private String itemCode;
    private BigDecimal requiredQty;
    private BigDecimal availableQty;
    private BigDecimal shortageQty;
    private Double fillRate;
    private String urgencyLevel;
    private java.time.LocalDate requiredDate;
    private String traceId;
    private Boolean urgent;
}

/**
 * MPS 需求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MpsRequirement {
    private String materialCode;
    private Integer quantity;
    private java.time.LocalDate requirementDate;
    private String sourceDocument;
}

/**
 * Trace 请求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class TraceRequest {
    private String documentType;
    private String documentId;
    private String parentTraceId;
}

/**
 * 变更影响分析
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ChangeImpactAnalysis {
    private String sourceDocument;
    private String sourceTraceId;
    private BigDecimal oldQuantity;
    private BigDecimal newQuantity;
    private BigDecimal quantityChange;
    private List<?> affectedDownstream;
    private List<?> affectedPurchaseOrders;
    private List<?> affectedManufacturingOrders;
    private String impactLevel;
    private String recommendation;
    private Boolean medicalImpact;
    private String status;
    private String message;
}

/**
 * 批次追溯结果
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class BatchTraceResult {
    private String batchNo;
    private List<?> traceChain;
    private Boolean isComplete;
}
