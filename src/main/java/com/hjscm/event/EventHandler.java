package com.hjscm.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 事件监听器 - 处理领域事件
 */
@Component
public class EventHandler {
    
    // 事件处理器注册表
    private final Map<String, EventHandler> handlers = new ConcurrentHashMap<>();
    
    /**
     * 处理状态变更事件
     */
    @EventListener
    public void handleStatusChange(DomainEvent event) {
        System.out.println("处理状态变更事件: " + event.getEventType());
        
        switch (event.getDocumentType()) {
            case "SO":
                handleSalesOrderEvent(event);
                break;
            case "PO":
                handlePurchaseOrderEvent(event);
                break;
            case "MO":
                handleManufacturingOrderEvent(event);
                break;
            case "GR":
                handleGoodsReceiptEvent(event);
                break;
            default:
                System.out.println("未知单据类型: " + event.getDocumentType());
        }
    }
    
    private void handleSalesOrderEvent(DomainEvent event) {
        switch (event.getEventType()) {
            case "EVT_SO_CONFIRM":
                // SO确认触发MRP
                System.out.println("触发MRP计算");
                break;
            case "EVT_SO_SHIP":
                // 发货更新ATP
                System.out.println("更新ATP");
                break;
            default:
                break;
        }
    }
    
    private void handlePurchaseOrderEvent(DomainEvent event) {
        switch (event.getEventType()) {
            case "EVT_PO_ACK":
                // PO确认更新供应商绩效
                System.out.println("更新供应商绩效");
                break;
            case "EVT_PO_SHIP":
                // 发货更新在途
                System.out.println("更新在途库存");
                break;
            default:
                break;
        }
    }
    
    private void handleManufacturingOrderEvent(DomainEvent event) {
        switch (event.getEventType()) {
            case "EVT_MO_RELEASE":
                // 工单释放触发领料
                System.out.println("触发领料单");
                break;
            case "EVT_MO_COMPLETE":
                // 工单完工更新成品库存
                System.out.println("更新成品库存");
                break;
            default:
                break;
        }
    }
    
    private void handleGoodsReceiptEvent(DomainEvent event) {
        switch (event.getEventType()) {
            case "EVT_GR_POST":
                // GR过账自动入库
                System.out.println("自动入库");
                break;
            default:
                break;
        }
    }
}
