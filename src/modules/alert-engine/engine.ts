// ==================== 预警规则解析引擎 ====================

import type { 
  AlertRule, RuleCondition, ConditionGroup, ConditionLogic, ConditionOperator 
} from './types';

// 条件运算符映射
const OPERATOR_MAP: Record<ConditionOperator, string> = {
  'eq': '===',
  'ne': '!==',
  'gt': '>',
  'gte': '>=',
  'lt': '<',
  'lte': '<=',
  'in': 'includes',
  'notIn': '!includes',
  'contains': 'includes',
  'startsWith': 'startsWith',
  'between': 'between',
  'isNull': '=== null',
  'isNotNull': '!== null'
};

// 值解析器
function parseValue(value: any, context: Record<string, any>): any {
  if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
    const field = value.slice(2, -1);
    return getNestedValue(context, field);
  }
  return value;
}

// 获取嵌套值
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

// 条件评估
function evaluateCondition(
  condition: RuleCondition,
  context: Record<string, any>
): boolean {
  const fieldValue = getNestedValue(context, condition.field);
  const targetValue = parseValue(condition.value, context);
  
  switch (condition.operator) {
    case 'eq': return fieldValue === targetValue;
    case 'ne': return fieldValue !== targetValue;
    case 'gt': return fieldValue > targetValue;
    case 'gte': return fieldValue >= targetValue;
    case 'lt': return fieldValue < targetValue;
    case 'lte': return fieldValue <= targetValue;
    case 'in': return Array.isArray(targetValue) && targetValue.includes(fieldValue);
    case 'notIn': return Array.isArray(targetValue) && !targetValue.includes(fieldValue);
    case 'contains': 
      return String(fieldValue).includes(String(targetValue));
    case 'startsWith': 
      return String(fieldValue).startsWith(String(targetValue));
    case 'between': 
      const [min, max] = targetValue;
      return fieldValue >= min && fieldValue <= max;
    case 'isNull': return fieldValue === null || fieldValue === undefined;
    case 'isNotNull': return fieldValue !== null && fieldValue !== undefined;
    default: return false;
  }
}

// 条件组评估
function evaluateConditionGroup(
  group: ConditionGroup,
  context: Record<string, any>
): boolean {
  const results = group.conditions.map(cond => {
    if ('conditions' in cond) {
      return evaluateConditionGroup(cond as ConditionGroup, context);
    }
    return evaluateCondition(cond as RuleCondition, context);
  });
  
  return group.logic === 'AND' 
    ? results.every(r => r) 
    : results.some(r => r);
}

// 规则评估器
export class RuleEngine {
  private rules: AlertRule[] = [];
  
  // 加载规则
  loadRules(rules: AlertRule[]): void {
    this.rules = rules.filter(r => r.status === 'enabled');
  }
  
  // 评估单条规则
  evaluateRule(rule: AlertRule, context: Record<string, any>): boolean {
    return evaluateConditionGroup({
      id: 'root',
      logic: rule.conditionLogic,
      conditions: rule.conditions
    } as ConditionGroup, context);
  }
  
  // 评估所有规则（定时触发）
  evaluateAll(context: Record<string, any>): string[] {
    const triggered: string[] = [];
    
    for (const rule of this.rules) {
      try {
        if (this.evaluateRule(rule, context)) {
          triggered.push(rule.id);
        }
      } catch (error) {
        console.error(`规则 ${rule.id} 评估失败:`, error);
      }
    }
    
    return triggered;
  }
  
  // 批量评估（带上下文）
  async evaluateBatch(
    rules: AlertRule[],
    contexts: Record<string, any>[]
  ): Promise<Map<string, string[]>> {
    const results = new Map<string, string[]>();
    
    for (const context of contexts) {
      const triggered = this.evaluateAll(context);
      const contextId = JSON.stringify(context);
      results.set(contextId, triggered);
    }
    
    return results;
  }
  
  // 规则验证（测试运行）
  testRule(
    rule: AlertRule,
    testContext: Record<string, any>
  ): { passed: boolean; result: boolean; error?: string } {
    try {
      const result = this.evaluateRule(rule, testContext);
      return { passed: true, result };
    } catch (error) {
      return { passed: false, result: false, error: String(error) };
    }
  }
  
  // 规则模板生成器
  generateTemplate(category: string): Partial<AlertRule> {
    const templates: Record<string, Partial<AlertRule>> = {
      supply: {
        name: '新供应风险规则',
        description: '请配置触发条件',
        category: 'supply',
        priority: 'P2',
        triggerType: 'schedule',
        schedule: { cron: '0 9 * * 1-5', timezone: 'Asia/Shanghai' },
        conditionLogic: 'AND',
        conditions: [
          { id: 'c1', field: 'supplier.otd', operator: 'lt', value: 0.9 }
        ],
        actions: [
          {
            id: 'a1',
            type: 'notification',
            template: '供应商OTD低于90%，请关注',
            recipients: { type: 'role', ids: ['采购经理'] }
          }
        ],
        escalations: []
      },
      demand: {
        name: '新需求异常规则',
        description: '请配置触发条件',
        category: 'demand',
        priority: 'P2',
        triggerType: 'event',
        conditionLogic: 'AND',
        conditions: [],
        actions: [],
        escalations: []
      },
      inventory: {
        name: '新库存预警规则',
        description: '请配置触发条件',
        category: 'inventory',
        priority: 'P2',
        triggerType: 'schedule',
        schedule: { cron: '0 8 * * *', timezone: 'Asia/Shanghai' },
        conditionLogic: 'AND',
        conditions: [],
        actions: [],
        escalations: []
      },
      cost: {
        name: '新成本预警规则',
        description: '请配置触发条件',
        category: 'cost',
        priority: 'P2',
        triggerType: 'event',
        conditionLogic: 'AND',
        conditions: [],
        actions: [],
        escalations: []
      }
    };
    
    return templates[category] || templates.supply;
  }
}

// 单例实例
export const ruleEngine = new RuleEngine();
