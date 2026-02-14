package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 安全库存计算服务
 * 公式：SS = Zα × σ × √L
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SafetyStockCalculator {

    private final SafetyStockConfigRepository configRepository;
    private final DailyDemandRepository demandRepository;

    /**
     * 计算安全库存
     */
    public BigDecimal calculateSafetyStock(String materialCode, String plantCode, Double serviceLevel) {
        // 获取配置
        SafetyStockConfig config = configRepository
            .findByMaterialCodeAndPlantCode(materialCode, plantCode)
            .orElse(createDefaultConfig(materialCode, plantCode));
        
        // 计算需求标准差
        Double stdDev = calculateDemandStdDev(materialCode, 90); // 90天历史
        
        // 获取提前期
        Integer leadTime = config.getLeadTimeDays() != null ? config.getLeadTimeDays() : 7;
        
        // 获取 Z 值
        Double zValue = getZValue(serviceLevel != null ? serviceLevel : 0.95);
        
        // 计算安全库存
        BigDecimal safetyStock = BigDecimal.valueOf(zValue)
            .multiply(BigDecimal.valueOf(stdDev))
            .multiply(BigDecimal.valueOf(Math.sqrt(leadTime)))
            .setScale(2, RoundingMode.HALF_UP);
        
        log.info("[SS] Calculated for {}: {} (Z={}, σ={}, L={}days)", 
            materialCode, safetyStock, zValue, stdDev, leadTime);
        
        return safetyStock;
    }

    /**
     * 动态安全库存（考虑季节性）
     */
    public BigDecimal calculateDynamicSafetyStock(String materialCode, String plantCode, LocalDate targetDate) {
        BigDecimal baseSS = calculateSafetyStock(materialCode, plantCode, 0.95);
        
        // 计算季节性因子
        Double seasonalFactor = calculateSeasonalFactor(materialCode, targetDate.getMonthValue());
        
        // 计算促销因子
        Double promotionFactor = getPromotionFactor(materialCode, targetDate);
        
        return baseSS.multiply(BigDecimal.valueOf(seasonalFactor))
            .multiply(BigDecimal.valueOf(promotionFactor))
            .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 计算需求标准差
     */
    private Double calculateDemandStdDev(String materialCode, int days) {
        List<DailyDemand> history = demandRepository
            .findByMaterialCodeAndDateAfter(materialCode, LocalDate.now().minusDays(days));
        
        if (history.isEmpty()) return 0.0;
        
        // 计算平均值
        double mean = history.stream()
            .mapToDouble(d -> d.getQuantity().doubleValue())
            .average().orElse(0);
        
        // 计算标准差
        double variance = history.stream()
            .mapToDouble(d -> Math.pow(d.getQuantity().doubleValue() - mean, 2))
            .average().orElse(0);
        
        return Math.sqrt(variance);
    }

    /**
     * 计算季节性因子
     */
    private Double calculateSeasonalFactor(String materialCode, int month) {
        // 简化：圣诞旺季（11-12月）增加安全库存
        if (month == 11 || month == 12) {
            return 1.3; // 旺季增加30%
        }
        // 春节（1-2月）可能受影响
        if (month == 1 || month == 2) {
            return 1.1;
        }
        return 1.0;
    }

    /**
     * 获取促销因子
     */
    private Double getPromotionFactor(String materialCode, LocalDate date) {
        // TODO: 从促销配置查询
        return 1.0;
    }

    /**
     * 获取 Z 值
     */
    private Double getZValue(Double serviceLevel) {
        if (serviceLevel >= 0.99) return 2.326;  // 99%
        if (serviceLevel >= 0.95) return 1.645;  // 95%
        if (serviceLevel >= 0.90) return 1.282;  // 90%
        return 1.0;  // 默认 84%
    }

    private SafetyStockConfig createDefaultConfig(String materialCode, String plantCode) {
        return SafetyStockConfig.builder()
            .materialCode(materialCode)
            .plantCode(plantCode)
            .serviceLevel(0.95)
            .leadTimeDays(7)
            .build();
    }
}
