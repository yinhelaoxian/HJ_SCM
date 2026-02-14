package com.hjscm.controller;

import com.hjscm.service.TraceIdService;
import com.hjscm.entity.TraceIdEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Trace ID API 控制器
 */
@RestController
@RequestMapping("/api/v1/trace")
public class TraceController {

    @Autowired
    private TraceIdService traceIdService;

    @GetMapping("/{traceId}")
    public TraceIdEntity getTrace(@PathVariable String traceId) {
        return traceIdService.traceBackward(traceId).get(0);
    }

    @GetMapping("/{traceId}/forward")
    public Object traceForward(@PathVariable String traceId) {
        return traceIdService.traceForward(traceId);
    }

    @GetMapping("/{traceId}/backward")
    public Object traceBackward(@PathVariable String traceId) {
        return traceIdService.traceBackward(traceId);
    }
}
