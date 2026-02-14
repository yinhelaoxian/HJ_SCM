package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * MRP API控制器
 */
@RestController
@RequestMapping("/api/v1/mrp")
public class MRPController {

    @Autowired
    private MRPEngineService mrpEngineService;

    /**
     * MRP计算
     */
    @PostMapping("/calculate")
    public ResponseEntity<MRPResult> calculateMRP(@RequestBody MRPRequest request) {
        MRPResult result = mrpEngineService.calculateMRP(request);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * 批量MRP计算
     */
    @PostMapping("/batch-calculate")
    public ResponseEntity<Map<String, MRPResult>> batchCalculate(
            @RequestBody Map<String, MRPRequest> requests) {
        
        Map<String, MRPResult> results = new java.util.HashMap<>();
        
        requests.forEach((key, request) -> {
            results.put(key, mrpEngineService.calculateMRP(request));
        });
        
        return ResponseEntity.ok(results);
    }
}
