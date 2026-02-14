package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.GenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * GenAI API控制器
 */
@RestController
@RequestMapping("/api/v1/ai")
public class GenAIController {

    @Autowired
    private GenAIService genAIService;

    /**
     * 自然语言查询
     */
    @PostMapping("/query")
    public ResponseEntity<GenAIResponse> query(@RequestBody GenAIRequest request) {
        GenAIResponse response = genAIService.processQuery(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 快捷查询接口
     */
    @GetMapping("/quick/{queryType}")
    public ResponseEntity<GenAIResponse> quickQuery(
            @PathVariable String queryType,
            @RequestParam(required = false) String param) {
        
        String query = switch (queryType) {
            case "shortage" -> "分析最近7天缺料物料";
            case "supplier" -> "评估" + (param != null ? param : "所有") + "供应商绩效";
            case "inventory" -> "分析库存健康度";
            case "forecast" -> "预测未来4周需求";
            default -> param != null ? param : "查询数据";
        };
        
        GenAIRequest request = GenAIRequest.builder()
            .query(query)
            .build();
        
        return ResponseEntity.ok(genAIService.processQuery(request));
    }
}
