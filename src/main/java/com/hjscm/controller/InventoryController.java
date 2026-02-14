package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 库存 API 控制器
 */
@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * 多级库存查询
     */
    @PostMapping("/levels")
    public ResponseEntity<MultiLevelInventoryResult> getMultiLevelInventory(
            @RequestBody MultiLevelInventoryRequest request) {
        MultiLevelInventoryResult result = 
            inventoryService.getMultiLevelInventory(request);
        return ResponseEntity.ok(result);
    }

    /**
     * ATP计算
     */
    @PostMapping("/atp")
    public ResponseEntity<ATPResult> calculateATP(@RequestBody ATPRequest request) {
        ATPResult result = inventoryService.calculateATP(request);
        return ResponseEntity.ok(result);
    }

    /**
     * 批次追踪
     */
    @GetMapping("/batch/{batchId}/trace")
    public ResponseEntity<BatchTraceResult> traceBatch(@PathVariable String batchId) {
        BatchTraceResult result = inventoryService.traceBatchForward(batchId);
        return ResponseEntity.ok(result);
    }

    /**
     * 呆滞检测
     */
    @PostMapping("/stagnation/detect")
    public ResponseEntity<StagnationDetectionResult> detectStagnation(
            @RequestBody(required = false) StagnationDetectionRequest request) {
        if (request == null) {
            request = StagnationDetectionRequest.builder()
                .maxDaysInStock(90)
                .minTurnoverRate(2.0)
                .build();
        }
        StagnationDetectionResult result = 
            inventoryService.detectStagnation(request);
        return ResponseEntity.ok(result);
    }
}
