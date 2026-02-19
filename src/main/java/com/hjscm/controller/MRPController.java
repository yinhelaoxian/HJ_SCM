package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * MRP API控制器
 * 
 * 匹配前端 API: src/services/api.ts
 */
@Slf4j
@RestController
@RequestMapping("/api/mrp")
@RequiredArgsConstructor
public class MRPController {

    private final MRPEngineService mrpEngineService;
    private final MrpDataService mrpDataService;

    /**
     * 执行 MRP 运算
     * 
     * 前端调用: mrpApi.runMrp(params)
     */
    @PostMapping("/run")
    public ResponseEntity<MrpRunResponse> runMrp(@RequestBody MrpRunRequest request) {
        log.info("[API] MRP run requested. mode={}, from={}, to={}", 
            request.getRunMode(), request.getPlanFromDate(), request.getPlanToDate());
        
        MrpRunResponse response = mrpEngineService.runMrp(request);
        
        if ("COMPLETED".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 查询物料需求
     * 
     * 前端调用: mrpApi.getRequirements(params)
     */
    @GetMapping("/requirements")
    public ResponseEntity<List<MpsRequirement>> getRequirements(
            @RequestParam(required = false) String materialCode,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        
        MrpRunRequest request = MrpRunRequest.builder()
            .runMode("FORECAST")
            .planFromDate(fromDate != null ? java.time.LocalDate.parse(fromDate) : java.time.LocalDate.now())
            .planToDate(toDate != null ? java.time.LocalDate.parse(toDate) : java.time.LocalDate.now().plusMonths(3))
            .plantCode("PLA-001")
            .build();
        
        List<MpsRequirement> requirements = mrpDataService.getMpsRequirements(request);
        return ResponseEntity.ok(requirements);
    }

    /**
     * 齐套检查
     * 
     * 前端调用: mrpApi.checkKit(params)
     */
    @PostMapping("/kit-check")
    public ResponseEntity<KitCheckResult> checkKit(@RequestBody Map<String, Object> params) {
        // TODO: 实现齐套检查
        return ResponseEntity.ok(new KitCheckResult());
    }

    /**
     * 获取采购建议
     * 
     * 前端调用: mrpApi.getSuggestions()
     */
    @GetMapping("/suggestions")
    public ResponseEntity<List<ProcurementSuggestion>> getSuggestions() {
        // TODO: 从数据库查询采购建议
        return ResponseEntity.ok(List.of());
    }

    /**
     * BOM 展开
     * 
     * 前端调用: mrpApi.explodeBom(params)
     */
    @PostMapping("/bom/explode")
    public ResponseEntity<List<MrpRequirement>> explodeBom(
            @RequestBody Map<String, Object> params) {
        
        String materialCode = (String) params.get("materialCode");
        Number quantity = (Number) params.get("quantity");
        Integer level = params.get("level") != null ? (Integer) params.get("level") : 3;
        
        if (materialCode == null || quantity == null) {
            return ResponseEntity.badRequest().build();
        }
        
        java.math.BigDecimal qty = java.math.BigDecimal.valueOf(quantity.doubleValue());
        List<MrpRequirement> requirements = mrpEngineService.explodeBom(materialCode, qty, level);
        
        return ResponseEntity.ok(requirements);
    }
}
