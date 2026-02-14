package com.hjscm.service;

import com.hjscm.entity.StateTransitionEntity;
import com.hjscm.dto.StateTransitionRequest;
import com.hjscm.dto.StateTransitionResult;
import com.hjscm.event.EventPublisher;
import org.springframework.stereotype.Service;
import java.util.Map;

/**
 * 状态机引擎服务
 * 核心职责：管理五大核心单据(SO/PO/MO/GR/DN)的状态流转
 */
@Service
public class StateMachineEngine {

    // 状态机配置
    private static final Map<String, Map<String, String>> STATE_MACHINE = Map.of(
        "SO", Map.of(
            "DRAFT", "OPEN",
            "OPEN", "CONFIRMED",
            "CONFIRMED", "IN_PRODUCTION",
            "IN_PRODUCTION", "SHIPPED",
            "SHIPPED", "DELIVERED",
            "DELIVERED", "CLOSED"
        ),
        "PO", Map.of(
            "DRAFT", "SENT",
            "SENT", "ACKNOWLEDGED",
            "ACKNOWLEDGED", "IN_TRANSIT",
            "IN_TRANSIT", "PARTIALLY_RECEIVED",
            "PARTIALLY_RECEIVED", "COMPLETED"
        ),
        "MO", Map.of(
            "PLANNED", "RELEASED",
            "RELEASED", "IN_EXECUTION",
            "IN_EXECUTION", "COMPLETED",
            "COMPLETED", "CLOSED"
        ),
        "GR", Map.of(
            "DRAFT", "VERIFIED",
            "VERIFIED", "POSTED",
            "POSTED", "CLOSED"
        ),
        "DN", Map.of(
            "DRAFT", "PICKED",
            "PICKED", "PACKED",
            "PACKED", "SHIPPED",
            "SHIPPED", "DELIVERED"
        )
    );

    public StateTransitionResult transition(StateTransitionRequest request) {
        // 1. 验证事件合法性
        validateEvent(request);
        
        // 2. 检查状态转换规则
        String targetState = STATE_MACHINE
            .get(request.getDocumentType())
            .get(request.getCurrentStatus());
        
        if (targetState == null) {
            return StateTransitionResult.error("非法状态转换");
        }
        
        // 3. 执行状态变更
        updateStatus(request.getDocumentId(), targetState);
        
        // 4. 触发下游联动
        triggerDownstream(request);
        
        // 5. 发布事件
        EventPublisher.publish(createEvent(request, targetState));
        
        return StateTransitionResult.success(targetState);
    }

    private void validateEvent(StateTransitionRequest request) {
        // 权限校验、业务规则校验
    }

    private void triggerDownstream(StateTransitionRequest request) {
        // 根据不同单据类型触发下游服务
        switch (request.getDocumentType()) {
            case "SO" -> triggerMRP(request);
            case "PO" -> updateSupplierPerformance(request);
            case "GR" -> autoReceive(request);
        }
    }

    private void triggerMRP(StateTransitionRequest request) {
        // 触发MRP计算服务
    }

    private void updateSupplierPerformance(StateTransitionRequest request) {
        // 更新供应商绩效
    }

    private void autoReceive(StateTransitionRequest request) {
        // 自动入库
    }
}
