package com.hjscm.service.ai;

import com.hjscm.entity.*;
import com.hjscm.dto.*;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * AI智能异常建议引擎
 * 
 * 功能：
 * - 自动分析异常类型
 * - 推荐处理方案
 * - 学习历史处理记录
 */
@Service
public class AIAnomalyAdvisor {

    // 异常处理知识库
    private static final Map<String, List<Solution>> SOLUTION_KB = Map.of(
        "STOCKOUT", List.of(
            new Solution("紧急补货", "向供应商下达紧急订单", 0.9),
            new Solution("调拨", "从其他仓库调拨", 0.7),
            new Solution("延迟交付", "与客户协商延迟", 0.3)
        ),
        "OVERSTOCK", List.of(
            new Solution("促销", "通过促销活动消化库存", 0.8),
            new Solution("退回", "退回给供应商", 0.5),
            new Solution("转售", "转到其他渠道销售", 0.4)
        ),
        "DELAY", List.of(
            new Solution("加急", "支付加急费用加速生产", 0.7),
            new Solution("空运", "使用空运缩短物流时间", 0.6),
            new Solution("替代", "使用替代物料", 0.5)
        ),
        "QUALITY", List.of(
            new Solution("挑选", "全检后挑选合格品", 0.7),
            new Solution("返工", "返工处理不合格品", 0.6),
            new Solution("报废", "报废不合格品", 0.2)
        )
    );

    /**
     * 分析异常并给出建议
     */
    public AnomalyAdvice analyze(AnomalyContext context) {
        // 1. 异常分类
        String anomalyType = classifyAnomaly(context);
        
        // 2. 获取推荐方案
        List<Solution> solutions = SOLUTION_KB.getOrDefault(anomalyType, List.of());
        
        // 3. 根据上下文排序
        List<ScoredSolution> ranked = rankSolutions(solutions, context);
        
        // 4. 计算置信度
        double confidence = calculateConfidence(anomalyType, context);
        
        return AnomalyAdvice.builder()
            .anomalyType(anomalyType)
            .severity(assessSeverity(context))
            .solutions(ranked)
            .confidence(confidence)
            .reasoning(generateReasoning(anomalyType, context))
            .build();
    }

    /**
     * 异常分类
     */
    private String classifyAnomaly(AnomalyContext context) {
        String type = context.getAnomaly().getType();
        double score = context.getAnomaly().getScore();
        
        if ("STOCKOUT".equals(type) && score > 80) return "STOCKOUT";
        if ("OVERSTOCK".equals(type) && score > 80) return "OVERSTOCK";
        if ("DELAY".equals(type)) return "DELAY";
        if ("QUALITY".equals(type)) return "QUALITY";
        
        return "GENERAL";
    }

    /**
     * 方案排序（考虑上下文）
     */
    private List<ScoredSolution> rankSolutions(
            List<Solution> solutions, 
            AnomalyContext context) {
        
        return solutions.stream()
            .map(s -> ScoredSolution.builder()
                .action(s.action())
                .description(s.description())
                .baseScore(s.score)
                .adjustedScore(adjustScore(s.score(), context))
                .risk(assessRisk(s.action(), context))
                .cost(estimateCost(s.action(), context))
                .build())
            .sorted((a, b) -> Double.compare(b.getAdjustedScore(), a.getAdjustedScore()))
            .toList();
    }

    /**
     * 置信度计算
     */
    private double calculateConfidence(String type, AnomalyContext context) {
        double base = 0.7;
        if (context.getHistoricalSimilar() != null) {
            base += 0.2 * context.getHistoricalSimilar().getSuccessRate();
        }
        return Math.min(0.95, base);
    }

    /**
     * 生成推理说明
     */
    private String generateReasoning(String type, AnomalyContext context) {
        return switch (type) {
            case "STOCKOUT" -> String.format(
                "检测到%s缺料风险，建议优先考虑%s方案，可快速恢复供应",
                context.getMaterialName(),
                SOLUTION_KB.get("STOCKOUT").get(0).action()
            );
            case "OVERSTOCK" -> String.format(
                "%s库存周转率低于%.1f，建议通过%s加速库存消化",
                context.getMaterialName(),
                context.getTargetTurnover(),
                SOLUTION_KB.get("OVERSTOCK").get(0).action()
            );
            default -> "根据异常分析，建议优先处理高风险项";
        };
    }

    private double adjustScore(double score, AnomalyContext context) {
        return score;
    }

    private String assessRisk(String action, AnomalyContext context) {
        return switch (action) {
            case "报废" -> "HIGH";
            case "延迟交付" -> "MEDIUM";
            default -> "LOW";
        };
    }

    private double estimateCost(String action, AnomalyContext context) {
        return switch (action) {
            case "空运" -> 5000;
            case "加急" -> 2000;
            default -> 500;
        };
    }

    private String assessSeverity(AnomalyContext context) {
        return context.getAnomaly().getScore() > 80 ? "HIGH" : 
               context.getAnomaly().getScore() > 50 ? "MEDIUM" : "LOW";
    }

    record Solution(String action, String description, double score) {}
}
