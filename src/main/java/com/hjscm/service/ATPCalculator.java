package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ATP 可承诺量计算服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ATPCalculator {

    private final InventoryBalanceRepository inventoryRepository;
    private final InTransitOrderRepository inTransitRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final MrpReservationRepository reservationRepository;

    /**
     * 计算 ATP
     * 
     * ATP = 可用库存 + 在途量 - 已分配量 - 预留量
     */
    public ATPResult calculateATP(ATPRequest request) {
        log.info("[ATP] Calculating for {} qty={} date={}", 
            request.getMaterialCode(), request.getRequestedQty(), request.getRequestedDate());
        
        // 1. 查询可用库存
        BigDecimal availableQty = getAvailableQty(
            request.getMaterialCode(), 
            request.getPlantCode()
        );
        
        // 2. 查询在途量（需求日期之前到货）
        BigDecimal inTransitQty = getInTransitQty(
            request.getMaterialCode(),
            request.getPlantCode(),
            request.getRequestedDate()
        );
        
        // 3. 查询已分配量（已承诺给其他订单）
        BigDecimal allocatedQty = getAllocatedQty(
            request.getMaterialCode(),
            request.getPlantCode(),
            request.getRequestedDate()
        );
        
        // 4. 查询 MRP 预留
        BigDecimal reservedQty = getReservedQty(
            request.getMaterialCode(),
            request.getPlantCode(),
            request.getRequestedDate()
        );
        
        // 5. 计算 ATP
        BigDecimal atp = availableQty
            .add(inTransitQty)
            .subtract(allocatedQty)
            .subtract(reservedQty);
        
        // 6. 判断是否可满足
        boolean canFulfill = atp.compareTo(request.getRequestedQty()) >= 0;
        
        // 7. 计算最早可承诺日期
        LocalDate promisedDate = canFulfill 
            ? request.getRequestedDate()
            : calculateFirstAvailableDate(request);
        
        ATPResult result = ATPResult.builder()
            .materialCode(request.getMaterialCode())
            .plantCode(request.getPlantCode())
            .requestedDate(request.getRequestedDate())
            .requestedQty(request.getRequestedQty())
            .availableQty(availableQty)
            .inTransitQty(inTransitQty)
            .allocatedQty(allocatedQty)
            .reservedQty(reservedQty)
            .atpQty(atp)
            .canFulfill(canFulfill)
            .promisedDate(promisedDate)
            .traceId("ATP-" + UUID.randomUUID().toString().substring(0, 8))
            .calculatedAt(LocalDateTime.now())
            .build();
        
        log.info("[ATP] Result: atp={} canFulfill={}", atp, canFulfill);
        
        return result;
    }

    /**
     * 批量计算 ATP
     */
    public List<ATPResult> calculateBatchATP(List<ATPRequest> requests) {
        return requests.stream()
            .map(this::calculateATP)
            .collect(Collectors.toList());
    }

    /**
     * CTP（可承诺能力）- 考虑产能约束
     */
    public CTPResult calculateCTP(CTPRequest request) {
        // 计算物料 ATP
        ATPResult atpResult = calculateATP(ATPRequest.builder()
            .materialCode(request.getMaterialCode())
            .plantCode(request.getPlantCode())
            .requestedQty(request.getRequestedQty())
            .requestedDate(request.getRequestedDate())
            .build());
        
        // 查询产能可用量
        BigDecimal availableCapacity = getAvailableCapacity(
            request.getPlantCode(),
            request.getWorkstationCode(),
            request.getRequestedDate()
        );
        
        // 判断约束类型
        String constraintType;
        if (!atpResult.isCanFulfill()) {
            constraintType = "MATERIAL";
        } else if (availableCapacity.compareTo(request.getRequestedQty()) < 0) {
            constraintType = "CAPACITY";
        } else {
            constraintType = "NONE";
        }
        
        return CTPResult.builder()
            .materialCode(request.getMaterialCode())
            .plantCode(request.getPlantCode())
            .workstationCode(request.getWorkstationCode())
            .requestedDate(request.getRequestedDate())
            .requestedQty(request.getRequestedQty())
            .atpResult(atpResult)
            .availableCapacity(availableCapacity)
            .constraintType(constraintType)
            .canFulfill("NONE".equals(constraintType))
            .build();
    }

    // === 查询方法 ===

    private BigDecimal getAvailableQty(String materialCode, String plantCode) {
        return inventoryRepository
            .findByMaterialCodeAndPlantCode(materialCode, plantCode)
            .map(b -> b.getQuantity().subtract(b.getReservedQty()))
            .orElse(BigDecimal.ZERO);
    }

    private BigDecimal getInTransitQty(String materialCode, String plantCode, LocalDate beforeDate) {
        return inTransitRepository
            .findByMaterialCodeAndPlantCodeAndArrivalDateBefore(
                materialCode, plantCode, beforeDate)
            .stream()
            .map(InTransitOrder::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getAllocatedQty(String materialCode, String plantCode, LocalDate date) {
        return salesOrderRepository
            .findAllocatedByMaterialAndDate(materialCode, plantCode, date)
            .stream()
            .map(SalesOrderItem::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getReservedQty(String materialCode, String plantCode, LocalDate date) {
        return reservationRepository
            .findByMaterialCodeAndPlantCodeAndDate(materialCode, plantCode, date)
            .stream()
            .map(MrpReservation::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getAvailableCapacity(String plantCode, String workstationCode, LocalDate date) {
        // TODO: 从产能模块查询
        return BigDecimal.valueOf(1000); // 模拟值
    }

    private LocalDate calculateFirstAvailableDate(ATPRequest request) {
        // 计算何时有足够库存
        LocalDate date = request.getRequestedDate();
        BigDecimal neededQty = request.getRequestedQty();
        
        while (true) {
            BigDecimal futureInTransit = getInTransitQty(
                request.getMaterialCode(),
                request.getPlantCode(),
                date
            );
            
            if (futureInTransit.compareTo(neededQty) >= 0) {
                return date;
            }
            
            neededQty = neededQty.subtract(futureInTransit);
            date = date.plusDays(1);
            
            if (date.isAfter(request.getRequestedDate().plusDays(90))) {
                return null; // 90天内无法满足
            }
        }
    }

    /**
     * ATP 请求
     */
    @lombok.Data
    @lombok.Builder
    public static class ATPRequest {
        private String materialCode;
        private String plantCode;
        private BigDecimal requestedQty;
        private LocalDate requestedDate;
    }

    /**
     * ATP 结果
     */
    @lombok.Data
    @lombok.Builder
    public static class ATPResult {
        private String materialCode;
        private String plantCode;
        private LocalDate requestedDate;
        private BigDecimal requestedQty;
        private BigDecimal availableQty;
        private BigDecimal inTransitQty;
        private BigDecimal allocatedQty;
        private BigDecimal reservedQty;
        private BigDecimal atpQty;
        private boolean canFulfill;
        private LocalDate promisedDate;
        private String traceId;
        private LocalDateTime calculatedAt;
    }

    /**
     * CTP 请求
     */
    @lombok.Data
    @lombok.Builder
    public static class CTPRequest {
        private String materialCode;
        private String plantCode;
        private String workstationCode;
        private BigDecimal requestedQty;
        private LocalDate requestedDate;
    }

    /**
     * CTP 结果
     */
    @lombok.Data
    @lombok.Builder
    public static class CTPResult {
        private String materialCode;
        private String plantCode;
        private String workstationCode;
        private LocalDate requestedDate;
        private BigDecimal requestedQty;
        private ATPResult atpResult;
        private BigDecimal availableCapacity;
        private String constraintType; // NONE / MATERIAL / CAPACITY
        private boolean canFulfill;
    }
}
