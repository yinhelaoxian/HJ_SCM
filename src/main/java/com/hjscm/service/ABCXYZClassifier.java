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
 * ABC-XYZ 分类服务
 * ABC: 按年度消耗金额占比
 * XYZ: 按需求波动系数
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ABCXYZClassifier {

    private final InventoryBalanceRepository balanceRepository;
    private final MonthlyDemandRepository demandRepository;

    /**
     * 执行 ABC-XYZ 分类
     */
    public List<MaterialClassification> classify(List<String> materialCodes) {
        List<MaterialClassification> results = new ArrayList<>();
        
        // 1. 计算年度消耗金额
        Map<String, BigDecimal> annualValue = calculateAnnualConsumption(materialCodes);
        
        // 2. ABC 分类
        Map<String, String> abcMap = calculateABCClassification(annualValue);
        
        // 3. XYZ 分类
        Map<String, String> xyzMap = calculateXYZClassification(materialCodes);
        
        // 4. 合并结果
        for (String code : materialCodes) {
            MaterialClassification mc = MaterialClassification.builder()
                .materialCode(code)
                .abcClass(abcMap.getOrDefault(code, "C"))
                .xyzClass(xyzMap.getOrDefault(code, "Y"))
                .annualValue(annualValue.getOrDefault(code, BigDecimal.ZERO))
                .combinedClass(calculateCombinedClass(
                    abcMap.getOrDefault(code, "C"), 
                    xyzMap.getOrDefault(code, "Y")))
                .classifiedAt(LocalDate.now())
                .build();
            
            results.add(mc);
        }
        
        log.info("[ABC-XYZ] Classified {} materials", results.size());
        return results;
    }

    /**
     * 计算年度消耗金额
     */
    private Map<String, BigDecimal> calculateAnnualConsumption(List<String> materialCodes) {
        Map<String, BigDecimal> result = new HashMap<>();
        
        for (String code : materialCodes) {
            // 获取最近12个月消耗
            List<MonthlyDemand> demands = demandRepository
                .findByMaterialCodeAndYear(code, LocalDate.now().getYear());
            
            BigDecimal annualValue = demands.stream()
                .map(d -> d.getQuantity().multiply(d.getUnitPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            result.put(code, annualValue);
        }
        
        return result;
    }

    /**
     * ABC 分类（帕累托法则）
     * A: 0-80% 金额占比
     * B: 80-95%
     * C: 95-100%
     */
    private Map<String, String> calculateABCClassification(Map<String, BigDecimal> annualValue) {
        // 按金额排序
        List<Map.Entry<String, BigDecimal>> sorted = annualValue.entrySet().stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .collect(Collectors.toList());
        
        // 计算总金额
        BigDecimal total = sorted.stream()
            .map(Map.Entry::getValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal cumulative = BigDecimal.ZERO;
        Map<String, String> result = new HashMap<>();
        
        for (Map.Entry<String, BigDecimal> entry : sorted) {
            cumulative = cumulative.add(entry.getValue());
            BigDecimal pct = cumulative.divide(total, 4, RoundingMode.HALF_UP);
            
            if (pct.doubleValue() <= 0.80) {
                result.put(entry.getKey(), "A");
            } else if (pct.doubleValue() <= 0.95) {
                result.put(entry.getKey(), "B");
            } else {
                result.put(entry.getKey(), "C");
            }
        }
        
        return result;
    }

    /**
     * XYZ 分类（需求波动系数 CV）
     * X: CV ≤ 0.5（稳定）
     * Y: 0.5 < CV ≤ 1.0（波动）
     * Z: CV > 1.0（很不稳定）
     */
    private Map<String, String> calculateXYZClassification(List<String> materialCodes) {
        Map<String, String> result = new HashMap<>();
        
        for (String code : materialCodes) {
            // 获取月度需求数据
            List<MonthlyDemand> demands = demandRepository
                .findByMaterialCodeAndYear(code, LocalDate.now().getYear());
            
            Double cv = calculateCoefficientOfVariation(demands);
            
            if (cv <= 0.5) {
                result.put(code, "X");
            } else if (cv <= 1.0) {
                result.put(code, "Y");
            } else {
                result.put(code, "Z");
            }
        }
        
        return result;
    }

    /**
     * 计算变异系数 CV = 标准差 / 平均值
     */
    private Double calculateCoefficientOfVariation(List<MonthlyDemand> demands) {
        if (demands.isEmpty()) return 1.0;
        
        double mean = demands.stream()
            .mapToDouble(d -> d.getQuantity().doubleValue())
            .average().orElse(0);
        
        if (mean == 0) return 1.0;
        
        double variance = demands.stream()
            .mapToDouble(d -> Math.pow(d.getQuantity().doubleValue() - mean, 2))
            .average().orElse(0);
        
        double stdDev = Math.sqrt(variance);
        return stdDev / mean;
    }

    /**
     * 综合分类策略
     */
    private String calculateCombinedClass(String abc, String xyz) {
        // AX, AY, BX, BY → HIGH（精细管理）
        if (abc.equals("A") && !xyz.equals("Z")) {
            return "HIGH";
        }
        // AZ, BZ, CX, CY → MEDIUM（常规管理）
        if (abc.equals("B") || xyz.equals("X")) {
            return "MEDIUM";
        }
        // CZ → LOW（简化管理）
        return "LOW";
    }

    /**
     * 生成管控策略建议
     */
    public Map<String, String> generateControlStrategy(MaterialClassification mc) {
        Map<String, String> strategy = new HashMap<>();
        
        String combined = mc.getCombinedClass();
        String abc = mc.getAbcClass();
        String xyz = mc.getXyzClass();
        
        // 库存策略
        if ("HIGH".equals(combined)) {
            strategy.put("inventoryPolicy", "严格管控");
            strategy.put("reviewFrequency", "每周");
            strategy.put("safetyStockPolicy", "动态计算");
            strategy.put("forecastMethod", "精细预测");
        } else if ("MEDIUM".equals(combined)) {
            strategy.put("inventoryPolicy", "常规管控");
            strategy.put("reviewFrequency", "每月");
            strategy.put("safetyStockPolicy", "固定值");
            strategy.put("forecastMethod", "常规预测");
        } else {
            strategy.put("inventoryPolicy", "简化管理");
            strategy.put("reviewFrequency", "每季");
            strategy.put("safetyStockPolicy", "最低库存");
            strategy.put("forecastMethod", "历史平均");
        }
        
        return strategy;
    }

    /**
     * 物料分类结果
     */
    @lombok.Data
    @lombok.Builder
    public static class MaterialClassification {
        private String materialCode;
        private String abcClass;
        private String xyzClass;
        private String combinedClass;
        private BigDecimal annualValue;
        private LocalDate classifiedAt;
    }
}
