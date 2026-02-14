package com.hjscm.controller;

import com.hjscm.dto.StateTransitionRequest;
import com.hjscm.dto.StateTransitionResult;
import com.hjscm.service.StateMachineEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 状态机 API 控制器
 */
@RestController
@RequestMapping("/api/v1/state-machine")
public class StateMachineController {

    @Autowired
    private StateMachineEngine stateMachineEngine;

    @PostMapping("/transition")
    public StateTransitionResult transition(@RequestBody StateTransitionRequest request) {
        return stateMachineEngine.transition(request);
    }

    @GetMapping("/{documentType}/{documentId}/status")
    public String getStatus(
            @PathVariable String documentType,
            @PathVariable String documentId) {
        // 查询当前状态
        return "{}";
    }

    @GetMapping("/{documentType}/{documentId}/events")
    public List getEvents(
            @PathVariable String documentType,
            @PathVariable String documentId) {
        // 查询状态变更历史
        return List.of();
    }
}
