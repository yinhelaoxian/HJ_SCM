import type { AlertRule, RuleCondition, RuleAction } from '../../types';

// 规则模拟数据库
const ruleDatabase: AlertRule[] = [
  {
    id: 'R001',
    name: '供应商OTD低于90%',
    description: '当供应商OTD低于90%时触发预警',
    category: 'supply',
    priority: 'P1',
    status: 'enabled',
    triggerType: 'schedule',
    schedule: { cron: '0 9 * * 1-5', timezone: 'Asia/Shanghai' },
    conditionLogic: 'AND',
    conditions: [
      { id: 'c1', field: 'supplier.otd', operator: 'lt', value: 0.9 }
    ],
    actions: [
      { id: 'a1', type: 'notification', template: '供应商OTD低于90%，请关注', recipients: { type: 'role', ids: ['采购经理'] } }
    ],
    escalations: [
      { level: 'P1', timeoutMinutes: 30, notifyRoles: ['采购总监'], actions: ['email', 'webhook'] }
    ],
    createdAt: '2026-02-01',
    updatedAt: '2026-02-10',
    createdBy: 'admin',
    version: 1
  },
  {
    id: 'R002',
    name: '库存低于安全库存',
    description: '在手库存低于安全库存时触发',
    category: 'inventory',
    priority: 'P1',
    status: 'enabled',
    triggerType: 'event',
    conditionLogic: 'AND',
    conditions: [
      { id: 'c1', field: 'inventory.onHand', operator: 'lt', value: '${inventory.safetyStock}' }
    ],
    actions: [
      { id: 'a1', type: 'notification', template: '库存不足，请及时补货', recipients: { type: 'department', ids: ['仓库'] } }
    ],
    escalations: [],
    createdAt: '2026-02-02',
    updatedAt: '2026-02-10',
    createdBy: 'admin',
    version: 1
  }
];

// 规则API
export async function GET() {
  return Response.json({ rules: ruleDatabase, total: ruleDatabase.length });
}

export async function POST(request: Request) {
  const rule = await request.json();
  rule.id = 'R' + Date.now();
  rule.createdAt = new Date().toISOString();
  rule.updatedAt = new Date().toISOString();
  rule.version = 1;
  ruleDatabase.push(rule);
  return Response.json({ success: true, rule });
}

export async function PUT(request: Request) {
  const { id, ...updates } = await request.json();
  const index = ruleDatabase.findIndex(r => r.id === id);
  if (index >= 0) {
    ruleDatabase[index] = { ...ruleDatabase[index], ...updates, updatedAt: new Date().toISOString() };
    return Response.json({ success: true });
  }
  return Response.json({ error: '规则不存在' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const index = ruleDatabase.findIndex(r => r.id === id);
  if (index >= 0) {
    ruleDatabase.splice(index, 1);
    return Response.json({ success: true });
  }
  return Response.json({ error: '规则不存在' }, { status: 404 });
}
