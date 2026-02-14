package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 呆滞检测服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StagnationDetector {

    private final InventoryBalanceRepository balanceRepository;
    private final InventoryTransactionRepository transactionRepository;

    /**
     * 检测呆滞风险
     */
    public StagnationResult detect(String materialCode, String plantCode) {
        StagnationResult result = StagnationResult.builder()
            .materialCode(materialCode)
            .plantCode(plantCode)
            .checkDate(LocalDate.now())
            .build();
        
        // 1. 计算库龄
        Integer daysInStock = calculateDaysInStock(materialCode, plantCode);
        result.setDaysInStock(daysInStock);
        
        // 2. 计算周转率
        Double turnoverRate = calculateTurnoverRate(materialCode, plantCode);
        result.setTurnoverRate(turnoverRate);
        
        // 3. 计算无移动天数
        Integer daysNoMovement = calculateDaysNoMovement(materialCode, plantCode);
        result.setDaysNoMovement(daysNoMovement);
        
        // 4. 计算呆滞风险评分
        Integer riskScore = calculateRiskScore(daysInStock, turnoverRate, daysNoMovement);
        result.setRiskScore(riskScore);
        
        // 5. 判断风险等级
        String riskLevel = riskScore >= 70 ? "HIGH" 
            : riskScore >= 40 ? "MEDIUM" : "LOW";
        result.setRiskLevel(riskLevel);
        
        // 6. 生成处置建议
        result.setRecommendations(generateRecommendations(riskLevel, result));
        
        log.info("[Stagnation] Detected for {}: {} (score={})", 
            materialCode, riskLevel, riskScore);
        
        return result;
    }

    /**
     * 全量呆滞检测
     */
    public List<StagnationResult> detectAll(String plantCode) {
        List<String> materialCodes = balanceRepository
            .findByPlantCode(plantCode)
            .stream()
            .map(InventoryBalance::getMaterialCode)
            .distinct()
            .collect(Collectors.toList());
        
        return materialCodes.stream()
            .map(code -> detect(code, plantCode))
            .filter(r -> !"LOW".equals(r.getRiskLevel()))
            .collect(Collectors.toList());
    }

    /**
     * 计算库龄
     */
    private Integer calculateDaysInStock(String materialCode, String plantCode) {
        LocalDate oldestBatch = balanceRepository
            .findByMaterialCodeAndPlantCode(materialCode, plantCode)
            .map(InventoryBalance::getOldestBatchDate)
            .orElse(null);
        
        if (oldestBatch == null) {
            return 0;
        }
        
        return (int) java.time.temporal.ChronoUnit.DAYS.between(
            oldestBatch, LocalDate.now());
    }

    /**
     * 计算周转率（次/年）
     * 周转率 = 年度发出数量 / 平均库存
     */
    private Double calculateTurnoverRate(String materialCode, String plantCode) {
        // 获取年度发出数量
        BigDecimal annualIssue = transactionRepository
            .findByMaterialCodeAndTypeAndYear(
                materialCode, "GI", LocalDate.now().getYear())
            .stream()
            .map(InventoryTransaction::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 获取平均库存
        BigDecimal avgInventory = balanceRepository
            .findByMaterialCode(materialCode)
            .stream()
            .map(InventoryBalance::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
        
        if (avgInventory.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        
        return annualIssue.divide(avgInventory, 2, java.math.RoundingMode.HALF_UP)
            .doubleValue();
    }

    /**
     * 计算无移动天数
     */
    private Integer calculateDaysNoMovement(String materialCode, String plantCode) {
        LocalDate lastMovement = transactionRepository
            .findLatestByMaterialCode(materialCode)
            .map(InventoryTransaction::getCreatedAt)
            .orElse(null);
        
        if (lastMovement == null) {
            return 999;
        }
        
        return (int) java.time.temporal.ChronoUnit.DAYS.between(
            lastMovement.toLocalDate(), LocalDate.now());
    }

    /**
     * 呆滞风险评分（满分100）
     */
    private Integer calculateRiskScore(Integer daysInStock, Double turnoverRate, Integer daysNoMovement) {
        int score = 0;
        
        // 库龄评分（最高30分）
        if (daysInStock > 180) score += 30;
        else if (daysInStock > 90) score += 20;
        else if (daysInStock > 60) score += 10;
        
        // 周转率评分（最高30分）
        if (turnoverRate < 2) score += 30;
        else if (turnoverRate < 5) score += 15;
        else if (turnoverRate < 10) score += 5;
        
        // 无移动评分（最高40分）
        if (daysNoMovement > 60) score += 40;
        else if (daysNoMovement > 30) score += 20;
        else if (daysNoMovement > 14) score += 10;
        
        return score;
    }

    /**
     * 生成处置建议
     */
    private List<String> generateRecommendations(String riskLevel, StagnationResult result) {
        List<String> recommendations = new ArrayList<>();
        
        if ("HIGH".equals(riskLevel)) {
            recommendations.add("⚠️ 高风险，建议立即处理");
            
            if (result.getDaysInStock() > 180) {
                recommendations.add("考虑促销或降价处理");
            }
            if (result.getDaysNoMovement() > 30) {
                recommendations.add("联系供应商协商退货或转售");
            }
            recommendations.add("评估是否转为呆滞库存");
            
        } else if ("MEDIUM".equals(riskLevel)) {
            recommendations.add("中风险，建议关注");
            recommendations.add("纳入下次盘点重点检查");
            recommendations.add("可考虑调拨至其他工厂");
            
        } else {
            recommendations.add("低风险，正常监控");
        }
        
        return recommendations;
    }

    /**
     * 呆滞检测结果
     */
    @lombok.Data
    @lombok.Builder
    public static class StagnationResult {
        private String materialCode;
        private String plantCode;
        private LocalDate checkDate;
        private Integer daysInStock;
        private Double turnoverRate;
        private Integer daysNoMovement;
        private Integer riskScore;
        private String riskLevel;
        private List<String> recommendations;
    }
}
