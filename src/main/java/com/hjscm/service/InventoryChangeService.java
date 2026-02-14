package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存变更服务
 * 与 MRP 实时联动
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryChangeService {

    private final InventoryBalanceRepository balanceRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final MrpEngineService mrpEngineService;

    /**
     * 处理库存变更
     * 触发 MRP 重算
     */
    @Transactional
    public InventoryBalance processChange(InventoryChange change) {
        log.info("[Inventory] Processing change: type={} qty={} material={}", 
            change.getTransType(), change.getTransQty(), change.getMaterialCode());
        
        // 1. 更新库存余额
        InventoryBalance balance = updateBalance(change);
        
        // 2. 记录交易流水
        recordTransaction(change);
        
        // 3. 发布库存变更事件（供 MRP 监听）
        publishChangeEvent(change, balance);
        
        // 4. 触发 MRP 重算（如果是关键变更）
        if (isCriticalChange(change, balance)) {
            triggerMrpRerun(change.getMaterialCode(), change.getPlantCode());
        }
        
        return balance;
    }

    /**
     * 库存变更请求
     */
    @lombok.Data
    @lombok.Builder
    public static class InventoryChange {
        private String transType; // GR/GI/ADJUST
        private String transCode; // 业务单据号
        private String materialCode;
        private String plantCode;
        private String warehouseCode;
        private String batchNo;
        private BigDecimal transQty; // 正数入库，负数出库
        private BigDecimal beforeQty;
        private BigDecimal afterQty;
        private String traceId;
        private LocalDateTime transAt;
    }

    private InventoryBalance updateBalance(InventoryChange change) {
        InventoryBalance balance = balanceRepository
            .findByMaterialCodeAndPlantCodeAndAsOfDate(
                change.getMaterialCode(), 
                change.getPlantCode(), 
                change.getTransAt().toLocalDate())
            .orElse(InventoryBalance.builder()
                .materialCode(change.getMaterialCode())
                .plantCode(change.getPlantCode())
                .asOfDate(change.getTransAt().toLocalDate())
                .quantity(BigDecimal.ZERO)
                .reservedQty(BigDecimal.ZERO)
                .build());
        
        BigDecimal newQty = balance.getQuantity().add(change.getTransQty());
        balance.setQuantity(newQty);
        balance.setUpdatedAt(LocalDateTime.now());
        
        return balanceRepository.save(balance);
    }

    private void recordTransaction(InventoryChange change) {
        InventoryTransaction trans = InventoryTransaction.builder()
            .transType(change.getTransType())
            .transCode(change.getTransCode())
            .materialCode(change.getMaterialCode())
            .plantCode(change.getPlantCode())
            .warehouseCode(change.getWarehouseCode())
            .batchNo(change.getBatchNo())
            .transQty(change.getTransQty())
            .beforeQty(change.getBeforeQty())
            .afterQty(change.getAfterQty())
            .traceId(change.getTraceId())
            .transAt(change.getTransAt())
            .build();
        
        transactionRepository.save(trans);
    }

    private void publishChangeEvent(InventoryChange change, InventoryBalance balance) {
        InventoryChangeEvent event = InventoryChangeEvent.builder()
            .materialCode(change.getMaterialCode())
            .plantCode(change.getPlantCode())
            .changeQty(change.getTransQty())
            .changeType(change.getTransType())
            .afterQty(balance.getQuantity())
            .traceId(change.getTraceId())
            .occurredAt(LocalDateTime.now())
            .build();
        
        eventPublisher.publishEvent(event);
    }

    private boolean isCriticalChange(InventoryChange change, InventoryBalance balance) {
        // 库存低于安全库存
        BigDecimal safetyStock = balance.getSafetyStock() != null 
            ? balance.getSafetyStock() 
            : BigDecimal.valueOf(100);
        
        return balance.getQuantity().compareTo(safetyStock) < 0;
    }

    private void triggerMrpRerun(String materialCode, String plantCode) {
        log.info("[Inventory] Triggering MRP rerun for {} in {}", materialCode, plantCode);
        
        // 异步触发 MRP 重算
        // TODO: 实际实现应该是异步任务
    }
}
