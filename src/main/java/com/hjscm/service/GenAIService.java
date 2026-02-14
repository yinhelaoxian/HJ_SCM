package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.service.inventory.InventoryService;
import com.hjscm.service.mrp.MRPEngineService;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * GenAI 服务 - 自然语言处理与Prompt模板
 *
 * 功能：
 * - 自然语言意图识别
 * - Prompt模板匹配
 * - 结果生成与置信度计算
 */
@Service
public class GenAIService {

    // Prompt模板库
    private static final Map<String, PromptTemplate> PROMPT_TEMPLATES = Map.of(
        "shortage_analysis", PromptTemplate.builder()
            .template("分析{period}内缺料物料，按影响金额排序，给出TOP5原因")
            .outputFormat("TABLE")
            .requiredParams(List.of("period"))
            .build(),
            
        "supplier_evaluation", PromptTemplate.builder()
            .template("评估{supplier}的{period}绩效：准时率/质量/响应速度")
            .outputFormat("JSON")
            .requiredParams(List.of("supplier", "period"))
            .build(),
            
        "inventory_optimization", PromptTemplate.builder()
            .template("分析{material}库存健康度，给出呆滞风险预警和处置建议")
            .outputFormat("JSON")
            .requiredParams(List.of("material"))
            .build(),
            
        "demand_forecast", PromptTemplate.builder()
            .template("基于{historyData}预测{material}未来{weeks}周需求，附带置信区间")
            .outputFormat("JSON")
            .requiredParams(List.of("material", "historyData"))
            .build(),
            
        "exception_analysis", PromptTemplate.builder()
            .template("分析异常{exceptionId}的影响范围和处理建议")
            .outputFormat("JSON")
            .requiredParams(List.of("exceptionId"))
            .build()
    );

    /**
     * 处理自然语言查询
     */
    public GenAIResponse processQuery(GenAIRequest request) {
        // 1. 意图识别
        Intent intent = recognizeIntent(request.getQuery());
        
        // 2. 选择Prompt模板
        PromptTemplate template = selectTemplate(intent);
        
        // 3. 参数提取
        Map<String, Object> params = extractParams(request.getQuery(), intent);
        
        // 4. 参数验证
        List<String> missingParams = validateParams(params, template);
        if (!missingParams.isEmpty()) {
            return GenAIResponse.builder()
                .success(false)
                .errorCode("GENAI001")
                .errorMessage("缺少必要参数: " + String.join(", ", missingParams))
                .build();
        }
        
        // 5. 执行查询（Mock数据）
        Object data = executeQuery(intent, params);
        
        // 6. 计算置信度
        double confidence = calculateConfidence(intent, params, data);
        
        // 7. 生成回答
        String answer = generateAnswer(intent, params, data);
        
        return GenAIResponse.builder()
            .success(true)
            .intent(intent.getName())
            .data(data)
            .answer(answer)
            .confidence(confidence)
            .factors(generateFactors(intent, data))
            .suggestions(generateSuggestions(intent, data))
            .build();
    }

    /**
     * 意图识别 - 简化版
     */
    private Intent recognizeIntent(String query) {
        String lower = query.toLowerCase();
        
        if (lower.contains("缺料")) {
            return new Intent("shortage_analysis", "缺料分析");
        } else if (lower.contains("供应商") && lower.contains("绩效")) {
            return new Intent("supplier_evaluation", "供应商评估");
        } else if (lower.contains("库存") && lower.contains("健康")) {
            return new Intent("inventory_optimization", "库存优化");
        } else if (lower.contains("预测") || lower.contains("需求")) {
            return new Intent("demand_forecast", "需求预测");
        } else if (lower.contains("异常") || lower.contains("问题")) {
            return new Intent("exception_analysis", "异常分析");
        }
        
        return new Intent("general_query", "通用查询");
    }

    /**
     * 选择Prompt模板
     */
    private PromptTemplate selectTemplate(Intent intent) {
        return PROMPT_TEMPLATES.getOrDefault(
            intent.getCode(),
            PROMPT_TEMPLATES.get("general_query")
        );
    }

    /**
     * 提取参数（简化版）
     */
    private Map<String, Object> extractParams(String query, Intent intent) {
        Map<String, Object> params = new HashMap<>();
        
        // 提取时间
        if (query.contains("最近7天")) {
            params.put("period", "最近7天");
        } else if (query.contains("最近30天")) {
            params.put("period", "最近30天");
        } else {
            params.put("period", "最近30天");
        }
        
        // 提取物料
        if (query.contains("电机")) {
            params.put("material", "MED-MOTOR-001");
        } else if (query.contains("控制")) {
            params.put("material", "MED-CONTROL-001");
        }
        
        return params;
    }

    /**
     * 验证参数
     */
    private List<String> validateParams(Map<String, Object> params, PromptTemplate template) {
        List<String> missing = new ArrayList<>();
        for (String required : template.getRequiredParams()) {
            if (!params.containsKey(required)) {
                missing.add(required);
            }
        }
        return missing;
    }

    /**
     * 执行查询（Mock数据）
     */
    private Object executeQuery(Intent intent, Map<String, Object> params) {
        return switch (intent.getCode()) {
            case "shortage_analysis" -> mockShortageData();
            case "supplier_evaluation" -> mockSupplierData();
            case "inventory_optimization" -> mockInventoryData();
            case "demand_forecast" -> mockForecastData();
            default -> Map.of("message", "查询已收到");
        };
    }

    /**
     * 计算置信度
     */
    private double calculateConfidence(Intent intent, Map<String, Object> params, Object data) {
        double base = 0.85;
        
        // 参数完整度加成
        if (params.containsKey("period")) base += 0.05;
        if (params.containsKey("material")) base += 0.05;
        
        return Math.min(base, 0.98);
    }

    /**
     * 生成回答
     */
    private String generateAnswer(Intent intent, Map<String, Object> params, Object data) {
        return switch (intent.getCode()) {
            case "shortage_analysis" -> "已为您分析缺料情况，发现3个高风险物料，建议优先处理。";
            case "supplier_evaluation" -> "供应商绩效评估完成，OTD率96.5%，质量合格率98.2%。";
            case "inventory_optimization" -> "库存健康度分析完成，发现2个呆滞风险物料。";
            case "demand_forecast" -> "需求预测已完成，未来4周需求趋势稳定。";
            default -> "查询已收到，正在处理。";
        };
    }

    /**
     * 生成影响因素
     */
    private List<String> generateFactors(Intent intent, Object data) {
        return List.of(
            "基于历史数据分析",
            "考虑季节性波动",
            "参考供应商交期"
        );
    }

    /**
     * 生成建议
     */
    private List<String> generateSuggestions(Intent intent, Object data) {
        return List.of(
            "建议增加安全库存15%",
            "建议关注缺料TOP1物料",
            "建议联系供应商确认交期"
        );
    }

    // ==================== Mock数据 ====================

    private Object mockShortageData() {
        return List.of(
            Map.of(
                "materialId", "MED-MOTOR-001",
                "materialName", "医养电机",
                "shortageQty", 500,
                "impactAmount", 42500.0,
                "reason", "供应商延期"
            ),
            Map.of(
                "materialId", "MED-CONTROL-001",
                "materialName", "控制模块",
                "shortageQty", 200,
                "impactAmount", 24000.0,
                "reason", "产能不足"
            )
        );
    }

    private Object mockSupplierData() {
        return Map.of(
            "supplierId", "SUP-001",
            "supplierName", "青岛电机有限公司",
            "otdRate", 96.5,
            "qualityRate", 98.2,
            "responseScore", 4.5,
            "overallScore", 4.8
        );
    }

    private Object mockInventoryData() {
        return Map.of(
            "materialId", "MED-MOTOR-001",
            "healthScore", 75,
            "daysInStock", 45,
            "turnoverRate", 2.1,
            "stagnationRisk", "MEDIUM",
            "recommendations", List.of(
                "建议促销清理库存",
                "考虑调拨至其他仓库"
            )
        );
    }

    private Object mockForecastData() {
        return Map.of(
            "materialId", "MED-MOTOR-001",
            "forecast", List.of(
                Map.of("week", "W1", "value", 1200, "low", 1000, "high", 1400),
                Map.of("week", "W2", "value", 1350, "low", 1100, "high", 1600),
                Map.of("week", "W3", "value", 1100, "low", 900, "high", 1300),
                Map.of("week", "W4", "value", 1450, "low", 1200, "high", 1700)
            ),
            "confidence", 0.88
        );
    }
}

/**
 * Intent内部类
 */
class Intent {
    private final String code;
    private final String name;
    
    public Intent(String code, String name) {
        this.code = code;
        this.name = name;
    }
    
    public String getCode() { return code; }
    public String getName() { return name; }
}

/**
 * PromptTemplate内部类
 */
@lombok.Data
class PromptTemplate {
    private String template;
    private String outputFormat;
    private List<String> requiredParams;
}
