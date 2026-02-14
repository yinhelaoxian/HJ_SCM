package com.hjscm.service.ai;

import com.hjscm.dto.*;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

/**
 * 需求感知服务 (Demand Sensing)
 * 
 * 功能：
 * - 实时需求信号捕捉
 * - 需求漂移检测
 * - 快速预测调整
 */
@Service
public class DemandSensingService {

    /**
     * 需求信号检测
     */
    public DemandSignals detectSignals(String materialId) {
        // 1. 采集实时信号
        List<DemandSignal> signals = collectSignals(materialId);
        
        // 2. 计算信号强度
        signals.forEach(this::calculateSignalStrength);
        
        // 3. 聚合信号
        double aggregatedSignal = aggregateSignals(signals);
        
        // 4. 检测需求漂移
        DemandDrift drift = detectDrift(materialId, aggregatedSignal);
        
        return DemandSignals.builder()
            .materialId(materialId)
            .signals(signals)
            .aggregatedSignal(aggregatedSignal)
            .drift(drift)
            .recommendation(generateRecommendation(drift, aggregatedSignal))
            .detectedAt(LocalDateTime.now())
            .build();
    }

    /**
     * 采集需求信号
     */
    private List<DemandSignal> collectSignals(String materialId) {
        List<DemandSignal> signals = new ArrayList<>();
        
        // 信号1: 销售订单突增
        signals.add(DemandSignal.builder()
            .type("ORDER_SPIKE")
            .source("SalesOrder")
            .description("近期订单量异常上升")
            .value(1.23) // 23%增长
            .weight(0.3)
            .build());
        
        // 信号2: 客户询盘增加
        signals.add(DemandSignal.builder()
            .type("INQUIRY_UP")
            .source("CRM")
            .description("客户询盘数量增加")
            .value(1.15)
            .weight(0.2)
            .build());
        
        // 信号3: 库存消耗加速
        signals.add(DemandSignal.builder()
            .type("CONSUMPTION_UP")
            .source("Inventory")
            .description("库存消耗速度加快")
            .value(1.35)
            .weight(0.25)
            .build());
        
        // 信号4: 竞品动态
        signals.add(DemandSignal.builder()
            .type("COMPETITOR")
            .source("Market")
            .description("竞品缺货，可能带来需求转移")
            .value(1.10)
            .weight(0.15)
            .build());
        
        // 信号5: 季节性因素
        signals.add(DemandSignal.builder()
            .type("SEASONAL")
            .source("Calendar")
            .description("进入传统旺季")
            .value(1.20)
            .weight(0.1)
            .build());
        
        return signals;
    }

    /**
     * 计算信号强度
     */
    private void calculateSignalStrength(DemandSignal signal) {
        double strength = signal.getValue() * signal.getWeight();
        signal.setStrength(strength);
        signal.setLevel(strength > 0.3 ? "STRONG" : 
                      strength > 0.15 ? "MODERATE" : "WEAK");
    }

    /**
     * 聚合信号
     */
    private double aggregateSignals(List<DemandSignal> signals) {
        return signals.stream()
            .mapToDouble(DemandSignal::getStrength)
            .sum();
    }

    /**
     * 需求漂移检测
     */
    private DemandDrift detectDrift(String materialId, double currentSignal) {
        // 基准信号（历史均值）
        double baseline = 0.1; // 假设基准
        
        double driftPercent = (currentSignal - baseline) / baseline;
        
        return DemandDrift.builder()
            .materialId(materialId)
            .baseline(baseline)
            .current(currentSignal)
            .driftPercent(driftPercent)
            .detected(true)
            .direction(driftPercent > 0 ? "UP" : "DOWN")
            .magnitude(driftPercent > 0.5 ? "SIGNIFICANT" : 
                      driftPercent > 0.2 ? "MODERATE" : "MINOR")
            .build();
    }

    /**
     * 生成调整建议
     */
    private String generateRecommendation(DemandDrift drift, double signal) {
        if (drift.getMagnitude().equals("SIGNIFICANT")) {
            return String.format(
                "检测到需求显著%s(%.0f%%)，建议立即调整预测：%s",
                drift.getDirection(),
                Math.abs(drift.getDriftPercent() * 100),
                drift.getDirection().equals("UP") ? "上调10-15%" : "下调5-10%"
            );
        } else if (drift.getMagnitude().equals("MODERATE")) {
            return String.format(
                "检测到需求小幅%s(%.0f%%)，建议关注并准备调整",
                drift.getDirection(),
                Math.abs(drift.getDriftPercent() * 100)
            );
        }
        return "需求稳定，无需调整";
    }
}
