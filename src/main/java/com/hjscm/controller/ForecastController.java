package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.DemandForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 预测 API 控制器
 */
@RestController
@RequestMapping("/api/v1/forecast")
public class ForecastController {

    @Autowired
    private DemandForecastService forecastService;

    /**
     * 执行需求预测
     */
    @PostMapping
    public ResponseEntity<ForecastResultDTO> forecast(@RequestBody ForecastRequest request) {
        ForecastResultDTO result = forecastService.forecast(request);
        return ResponseEntity.ok(result);
    }

    /**
     * 批量预测
     */
    @PostMapping("/batch")
    public ResponseEntity<Map<String, ForecastResultDTO>> batchForecast(
            @RequestBody Map<String, ForecastRequest> requests) {
        
        Map<String, ForecastResultDTO> results = new java.util.HashMap<>();
        
        requests.forEach((key, request) -> {
            results.put(key, forecastService.forecast(request));
        });
        
        return ResponseEntity.ok(results);
    }

    /**
     * 快捷预测接口
     */
    @GetMapping("/{materialId}")
    public ResponseEntity<ForecastResultDTO> quickForecast(
            @PathVariable String materialId,
            @RequestParam(defaultValue = "13") int weeks) {
        
        ForecastRequest request = ForecastRequest.builder()
            .materialId(materialId)
            .weeks(weeks)
            .method("seasonal")
            .build();
        
        return ResponseEntity.ok(forecastService.forecast(request));
    }
}
