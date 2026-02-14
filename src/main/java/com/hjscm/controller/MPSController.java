package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.MPSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * MPS API 控制器
 */
@RestController
@RequestMapping("/api/v1/mps")
public class MPSController {

    @Autowired
    private MPSService mpsService;

    /**
     * 生成滚动计划
     */
    @PostMapping("/rolling-plan")
    public ResponseEntity<MPSResult> generateRollingPlan(@RequestBody MPSRequest request) {
        MPSResult result = mpsService.generateRollingPlan(request);
        return ResponseEntity.ok(result);
    }

    /**
     * 快捷生成计划
     */
    @GetMapping("/{productId}")
    public ResponseEntity<MPSResult> quickGenerate(
            @PathVariable String productId) {
        MPSRequest request = MPSRequest.builder()
            .productId(productId)
            .build();
        
        return ResponseEntity.ok(mpsService.generateRollingPlan(request));
    }
}
