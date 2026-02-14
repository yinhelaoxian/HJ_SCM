package com.hjscm.service;

import com.hjscm.dto.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

/**
 * MPS 主生产计划服务
 * 
 * 功能：
 * - 13周滚动计划生成
 * - 产能约束计算
 * - 甘特图数据生成
 */
@Service
public class MPSService {

    /**
     * 生成13周滚动计划
     */
    public MPSResult generateRollingPlan(MPSRequest request) {
        String productId = request.getProductId();
        int weeks = 13;
        
        // 1. 加载需求预测
        List<WeekForecast> forecasts = loadForecasts(productId, weeks);
        
        // 2. 获取产能约束
        Map<Integer, Capacity> capacities = getCapacityConstraints(request.getWorkCenterId());
        
        // 3. 计算生产批量
        Map<String, Double> lotSizes = getLotSizes(request.getProductId());
        
        // 4. 生成周计划
        List<WeeklyPlan> plans = generateWeeklyPlans(forecasts, capacities, lotSizes);
        
        // 5. 计算产能利用率
        double utilization = calculateUtilization(plans, capacities);
        
        // 6. 识别冲突
        List<Conflict> conflicts = identifyConflicts(plans, capacities);
        
        // 7. 生成甘特图数据
        GanttChartData ganttData = generateGanttData(plans);
        
        return MPSResult.builder()
            .productId(productId)
            .weeklyPlans(plans)
            .ganttData(ganttData)
            .capacities(capacities)
            .utilization(utilization)
            .conflicts(conflicts)
            .generatedAt(new Date())
            .build();
    }

    private List<WeekForecast> loadForecasts(String productId, int weeks) {
        List<WeekForecast> forecasts = new ArrayList<>();
        LocalDate startDate = LocalDate.now().plusWeeks(1);
        
        // 模拟预测数据
        int[] quantities = {520, 580, 650, 720, 680, 620, 580, 520, 480, 420, 450, 490, 550};
        
        for (int week = 0; week < weeks; week++) {
            LocalDate date = startDate.plusWeeks(week);
            forecasts.add(WeekForecast.builder()
                .week(week + 1)
                .date(date)
                .forecastQuantity(quantities[week])
                .planQuantity(Math.ceil(quantities[week] / 100) * 100)
                .status("PLANNED")
                .build());
        }
        
        return forecasts;
    }

    private Map<Integer, Capacity> getCapacityConstraints(String workCenterId) {
        Map<Integer, Capacity> capacities = new LinkedHashMap<>();
        
        for (int week = 1; week <= 13; week++) {
            capacities.put(week, Capacity.builder()
                .week(week)
                .availableHours(week <= 4 ? 160 : 120) // 春节影响
                .plannedHours(80 + Math.random() * 40)
                .efficiency(0.85 + Math.random() * 0.1)
                .build());
        }
        
        return capacities;
    }

    private Map<String, Double> getLotSizes(String productId) {
        Map<String, Double> lotSizes = new HashMap<>();
        lotSizes.put("BATCH_SIZE", 100.0);
        lotSizes.put("MIN_LOT", 50.0);
        lotSizes.put("MAX_LOT", 1000.0);
        return lotSizes;
    }

    private List<WeeklyPlan> generateWeeklyPlans(
            List<WeekForecast> forecasts,
            Map<Integer, Capacity> capacities,
            Map<String, Double> lotSizes) {
        
        List<WeeklyPlan> plans = new ArrayList<>();
        
        for (WeekForecast forecast : forecasts) {
            int week = forecast.getWeek();
            Capacity capacity = capacities.get(week);
            
            // 计算计划数量（考虑产能约束）
            int planQuantity = (int) (capacity.getAvailableHours() * 10);
            planQuantity = Math.max(
                lotSizes.get("MIN_LOT").intValue(),
                Math.min(
                    lotSizes.get("MAX_LOT").intValue(),
                    planQuantity
                )
            );
            
            plans.add(WeeklyPlan.builder()
                .week(week)
                .date(forecast.getDate())
                .forecastQuantity(forecast.getForecastQuantity())
                .planQuantity(planQuantity)
                .capacityHours(capacity.getAvailableHours())
                .utilization(planQuantity / (capacity.getAvailableHours() * 10.0))
                .status(planQuantity < forecast.getForecastQuantity() ? "OVERLOAD" : "OK")
                .build());
        }
        
        return plans;
    }

    private double calculateUtilization(
            List<WeeklyPlan> plans,
            Map<Integer, Capacity> capacities) {
        double totalUtil = 0;
        int count = 0;
        
        for (WeeklyPlan plan : plans) {
            if (plan.getCapacityHours() > 0) {
                totalUtil += plan.getPlanQuantity() / (plan.getCapacityHours() * 10);
                count++;
            }
        }
        
        return count > 0 ? totalUtil / count : 0;
    }

    private List<Conflict> identifyConflicts(
            List<WeeklyPlan> plans,
            Map<Integer, Capacity> capacities) {
        List<Conflict> conflicts = new ArrayList<>();
        
        for (WeeklyPlan plan : plans) {
            if (plan.getForecastQuantity() > plan.getPlanQuantity()) {
                conflicts.add(Conflict.builder()
                    .week(plan.getWeek())
                    .type("CAPACITY_SHORTAGE")
                    .severity("HIGH")
                    .message(String.format(
                        "W%d: 预测%d > 计划%d，缺口%d",
                        plan.getWeek(),
                        plan.getForecastQuantity(),
                        plan.getPlanQuantity(),
                        plan.getForecastQuantity() - plan.getPlanQuantity()
                    ))
                    .suggestions(List.of(
                        "增加产能",
                        "调整交期",
                        "使用库存"
                    ))
                    .build());
            }
            
            Capacity capacity = capacities.get(plan.getWeek());
            if (capacity != null && capacity.getEfficiency() < 0.8) {
                conflicts.add(Conflict.builder()
                    .week(plan.getWeek())
                    .type("LOW_EFFICIENCY")
                    .severity("MEDIUM")
                    .message(String.format(
                        "W%d: 效率%.1f%%低于目标",
                        plan.getWeek(),
                        capacity.getEfficiency() * 100
                    ))
                    .suggestions(List.of(
                        "优化产线排程",
                        "增加班次"
                    ))
                    .build());
            }
        }
        
        return conflicts;
    }

    private GanttChartData generateGanttData(List<WeeklyPlan> plans) {
        List<GanttRow> rows = new ArrayList<>();
        
        // 产线排程
        List<GanttItem> items = new ArrayList<>();
        for (WeeklyPlan plan : plans) {
            items.add(GanttItem.builder()
                .name("W" + plan.getWeek())
                .start(plan.getDate())
                .end(plan.getDate().plusDays(5))
                .quantity(plan.getPlanQuantity())
                .status(plan.getStatus())
                .build());
        }
        
        rows.add(GanttRow.builder()
            .workCenter("装配线A")
            .items(items)
            .build());
        
        return GanttChartData.builder()
            .title("13周滚动计划甘特图")
            .startDate(plans.get(0).getDate())
            .endDate(plans.get(plans.size() - 1).getDate())
            .rows(rows)
            .build();
    }
}
