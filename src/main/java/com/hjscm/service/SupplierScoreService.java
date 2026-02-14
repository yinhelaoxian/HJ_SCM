package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

/**
 * 供应商评分模型
 * 
 * 评分维度：
 * - 质量 (40%)
 * - 交付 (30%)
 * - 价格 (20%)
 * - 服务 (10%)
 */
@Service
public class SupplierScoreService {

    @Autowired
    private SupplierEvaluationRepository evaluationRepository;

    // 评分权重
    private static final double WEIGHT_QUALITY = 0.40;
    private static final double WEIGHT_DELIVERY = 0.30;
    private static final double WEIGHT_PRICE = 0.20;
    private static final double WEIGHT_SERVICE = 0.10;

    /**
     * 计算供应商综合评分
     */
    public SupplierScore calculateScore(String supplierId, LocalDate start, LocalDate end) {
        // 1. 获取评价数据
        SupplierEvaluation eval = getEvaluationData(supplierId, start, end);
        
        // 2. 计算各维度得分
        double qualityScore = calculateQualityScore(eval);
        double deliveryScore = calculateDeliveryScore(eval);
        double priceScore = calculatePriceScore(eval);
        double serviceScore = calculateServiceScore(eval);
        
        // 3. 综合评分
        double totalScore = 
            qualityScore * WEIGHT_QUALITY +
            deliveryScore * WEIGHT_DELIVERY +
            priceScore * WEIGHT_PRICE +
            serviceScore * WEIGHT_SERVICE;
        
        // 4. 评级
        String grade = getGrade(totalScore);
        
        // 5. 计算趋势
        double trend = calculateTrend(supplierId, totalScore);
        
        return SupplierScore.builder()
            .supplierId(supplierId)
            .periodStart(start)
            .periodEnd(end)
            .qualityScore(qualityScore)
            .deliveryScore(deliveryScore)
            .priceScore(priceScore)
            .serviceScore(serviceScore)
            .totalScore(totalScore)
            .grade(grade)
            .trend(trend)
            .rank(getRank(supplierId, totalScore))
            .build();
    }

    /**
     * 质量得分 (40%)
     * 基于：来料合格率、批次合格率、质量问题数
     */
    private double calculateQualityScore(SupplierEvaluation eval) {
        double acceptanceRate = eval.getAcceptanceRate(); // 来料合格率
        double batchPassRate = eval.getBatchPassRate();   // 批次合格率
        int qualityIssues = eval.getQualityIssuesCount(); // 质量问题数
        
        // 基础分
        double score = acceptanceRate * 0.6 + batchPassRate * 0.4;
        
        // 扣分项
        if (qualityIssues > 5) score -= 5;
        if (qualityIssues > 10) score -= 10;
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * 交付得分 (30%)
     * 基于：准时交付率、平均交期偏差
     */
    private double calculateDeliveryScore(SupplierEvaluation eval) {
        double onTimeRate = eval.getOnTimeDeliveryRate();
        double avgLeadTimeDeviation = eval.getAvgLeadTimeDeviation();
        
        // 准时率基础分
        double score = onTimeRate * 0.7;
        
        // 交期偏差扣分 (每偏差1天扣2分)
        score -= Math.abs(avgLeadTimeDeviation) * 2;
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * 价格得分 (20%)
     * 基于：价格水平、价格稳定性
     */
    private double calculatePriceScore(SupplierEvaluation eval) {
        double priceLevel = eval.getPriceLevel(); // 0-100, 越低越好
        double priceStability = eval.getPriceStability(); // 稳定性
        
        // 价格得分 (反比)
        double score = (100 - priceLevel) * 0.6;
        
        // 稳定性加分
        score += priceStability * 0.4;
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * 服务得分 (10%)
     * 基于：响应速度、配合度
     */
    private double calculateServiceScore(SupplierEvaluation eval) {
        double responseSpeed = eval.getResponseSpeed(); // 响应速度评分
        double cooperation = eval.getCooperationLevel(); // 配合度
        
        return (responseSpeed + cooperation) / 2;
    }

    /**
     * 评级
     */
    private String getGrade(double score) {
        if (score >= 90) return "A+";
        if (score >= 80) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";
        return "D";
    }

    /**
     * 计算趋势
     */
    private double calculateTrend(String supplierId, double currentScore) {
        // 与上期比较
        Double previousScore = getPreviousScore(supplierId);
        if (previousScore == null) return 0;
        
        return ((currentScore - previousScore) / previousScore) * 100;
    }

    /**
     * 获取排名
     */
    private int getRank(String supplierId, double score) {
        return 1; // 简化实现
    }

    private SupplierEvaluation getEvaluationData(String supplierId, LocalDate start, LocalDate end) {
        // 从数据库获取
        return new SupplierEvaluation();
    }

    private Double getPreviousScore(String supplierId) {
        return null;
    }
}
