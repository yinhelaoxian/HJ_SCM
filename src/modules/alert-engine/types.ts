// ==================== 预警规则引擎类型定义 ====================

// 规则启用状态
export type RuleStatus = 'draft' | 'enabled' | 'disabled';

// 规则优先级
export type AlertPriority = 'P0' | 'P1' | 'P2' | 'P3';

// 条件运算符
export type ConditionOperator = 
  | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'notIn' | 'contains' | 'startsWith'
  | 'between' | 'isNull' | 'isNotNull';

// 动作类型
export type ActionType = 
  | 'notification'  // 站内通知
  | 'email'         // 邮件通知
  | 'webhook'       // Webhook回调
  | 'sms';          // 短信通知

// 条件组合方式
export type ConditionLogic = 'AND' | 'OR';

// 升级级别
export interface RuleEscalation {
  level: AlertPriority;
  timeoutMinutes: number;  // 超时时间
  notifyRoles: string[];     // 通知角色
  notifyUsers: string[];    // 通知用户
  actions: ActionType[];     // 升级动作
}

// 单个条件
export interface RuleCondition {
  id: string;
  field: string;           // 字段名
  operator: ConditionOperator;
  value: any;             // 比较值
  valueTo?: any;          // between用
}

// 条件组
export interface ConditionGroup {
  id: string;
  logic: ConditionLogic;
  conditions: (RuleCondition | ConditionGroup)[];
}

// 规则动作
export interface RuleAction {
  id: string;
  type: ActionType;
  template: string;       // 通知模板
  recipients: {
    type: 'role' | 'user' | 'department';
    ids: string[];
  };
}

// 预警规则主数据
export interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: string;        // 分类：supply/demand/inventory/cost
  priority: AlertPriority;
  status: RuleStatus;
  
  // 触发条件
  triggerType: 'schedule' | 'event';
  schedule?: {            // 定时触发
    cron: string;         // Cron表达式
    timezone?: string;
  };
  eventType?: string;      // 事件触发
  
  // 条件
  conditionLogic: ConditionLogic;
  conditions: (RuleCondition | ConditionGroup)[];
  
  // 动作
  actions: RuleAction[];
  
  // 升级规则
  escalations: RuleEscalation[];
  
  // 元数据
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  enabledAt?: Date;
  disabledAt?: Date;
  version: number;
}

// 预警记录
export interface AlertRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  priority: AlertPriority;
  title: string;
  message: string;
  triggeredAt: Date;
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  
  // 触发条件快照
  conditions: Record<string, any>;
  
  // 处理信息
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
  
  // 升级记录
  escalations: {
    level: AlertPriority;
    escalatedAt: Date;
    notifiedRoles: string[];
  }[];
}

// 预警统计
export interface AlertStatistics {
  total: number;
  byPriority: Record<AlertPriority, number>;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  trend: { date: string; count: number }[];
}

// 规则模板
export const RULE_TEMPLATES = {
  supply: [
    {
      name: '供应商OTD低于阈值',
      description: '供应商OTD低于设定阈值',
      category: 'supply',
      priority: 'P1',
      conditions: [{ field: 'supplier.otd', operator: 'lt', value: 0.9 }],
      actions: [{ type: 'notification', template: '供应商{{supplier.name}}的OTD为{{otd}}，请关注' }]
    },
    {
      name: '供应商库存预警',
      description: '供应商库存低于安全库存',
      category: 'supply',
      priority: 'P2',
      conditions: [{ field: 'supplier.inventory', operator: 'lt', value: 1000 }],
      actions: [{ type: 'notification', template: '供应商{{supplier.name}}库存不足，请及时补货' }]
    }
  ],
  demand: [
    {
      name: '需求预测偏差大',
      description: '实际需求与预测偏差超过阈值',
      category: 'demand',
      priority: 'P1',
      conditions: [{ field: 'demand.variance', operator: 'gt', value: 0.2 }],
      actions: [{ type: 'notification', template: '需求预测偏差{{variance}}，请分析原因' }]
    }
  ],
  inventory: [
    {
      name: '库存低于安全库存',
      description: '在手库存低于安全库存',
      category: 'inventory',
      priority: 'P1',
      conditions: [{ field: 'inventory.onHand', operator: 'lt', value: 'inventory.safetyStock' }],
      actions: [{ type: 'notification', template: '物料{{material.name}}库存不足，请及时补货' }]
    },
    {
      name: '呆滞库存预警',
      description: '物料超过N天未移动',
      category: 'inventory',
      priority: 'P2',
      conditions: [{ field: 'inventory.daysNotMoved', operator: 'gte', value: 180 }],
      actions: [{ type: 'notification', template: '{{material.name}}已呆滞180天，请处理' }]
    }
  ],
  cost: [
    {
      name: '成本超预算',
      description: '实际成本超过预算',
      category: 'cost',
      priority: 'P1',
      conditions: [{ field: 'cost.actual', operator: 'gt', value: 'cost.budget' }],
      actions: [{ type: 'notification', template: '成本超预算{{variance}}，请关注' }]
    }
  ]
};

// 规则分类
export const RULE_CATEGORIES = [
  { id: 'supply', name: '供应风险', color: '#E53935' },
  { id: 'demand', name: '需求异常', color: '#F57C00' },
  { id: 'inventory', name: '库存风险', color: '#00897B' },
  { id: 'cost', name: '成本风险', color: '#2D7DD2' }
];
