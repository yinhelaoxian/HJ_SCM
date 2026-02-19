// Mock API 服务
// 用于前后端联调测试
//
// ⚠️ 重要：供应商命名规范说明
// - 演示数据 (src/services/mock/mock.data.ts): SUP-DE-001, SUP-CN-012, SUP-CN-023, SUP-TH-007
// - 开发数据 (src/mock/services/mockAPI.ts): 使用统一的命名规范
// - 目的：消除两套数据命名不一致导致的混淆

// 模拟延迟
const MOCK_DELAY = 300;

// ==================== 供应商相关 ====================

export const mockSuppliers = [
  {
    id: 'SUP-DE-001',
    code: 'BUHLER',
    name: 'Bühler Motor GmbH',
    nameCn: '德国布尔电机',
    level: 'A',
    status: 'ACTIVE',
    country: 'DE',
    region: 'EMEA',
    contactName: 'Hans Mueller',
    contactPhone: '+49-89-1234-5678',
    contactEmail: 'h.mueller@buhler-motor.de'
  },
  {
    id: 'SUP-CN-012',
    code: 'SUZHOU_JINGQU',
    name: 'Suzhou Jingqu Technology',
    nameCn: '苏州精驱科技',
    level: 'A',
    status: 'ACTIVE',
    country: 'CN',
    region: 'APAC',
    contactName: '张经理',
    contactPhone: '138-5321-0001',
    contactEmail: 'zhang@suzhoujingqu.com'
  },
  {
    id: 'SUP-TH-007',
    code: 'THAI_TECH',
    name: 'Thai Tech Manufacturing',
    nameCn: '泰国科技制造',
    level: 'B',
    status: 'ACTIVE',
    country: 'TH',
    region: 'APAC',
    contactName: 'Somchai',
    contactPhone: '+66-2-1234-5678',
    contactEmail: 'somchai@thaitech.co.th'
  }
];

export const mockPurchaseOrders = [
  {
    id: 'PO-2026-001',
    supplierId: 'SUP-DE-001',
    supplierName: '青岛电机有限公司',
    materialId: 'MED-MOTOR-001',
    materialName: '医养电机',
    quantity: 500,
    unit: 'PCS',
    price: 85.00,
    currency: 'CNY',
    requestedDate: '2026-02-28',
    status: 'SENT',
    createdAt: '2026-02-10'
  },
  {
    id: 'PO-2026-002',
    supplierId: 'SUP-DE-001',
    supplierName: '青岛电机有限公司',
    materialId: 'MED-MOTOR-001',
    materialName: '医养电机',
    quantity: 300,
    unit: 'PCS',
    price: 85.00,
    currency: 'CNY',
    requestedDate: '2026-03-05',
    status: 'ACKNOWLEDGED',
    createdAt: '2026-02-08'
  },
  {
    id: 'PO-2026-003',
    supplierId: 'SUP-CN-012',
    supplierName: '中晶科技',
    materialId: 'MED-CONTROL-001',
    materialName: '控制模块',
    quantity: 200,
    unit: 'PCS',
    price: 120.00,
    currency: 'CNY',
    requestedDate: '2026-03-10',
    status: 'DRAFT',
    createdAt: '2026-02-12'
  }
];

// ==================== 库存相关 ====================

export const mockInventory = [
  {
    materialId: 'MED-MOTOR-001',
    materialName: '医养电机',
    factoryStock: 5200,
    inTransit: 1200,
    consignment: 300,
    returnStock: 50,
    total: 6750
  },
  {
    materialId: 'MED-CONTROL-001',
    materialName: '控制模块',
    factoryStock: 8500,
    inTransit: 2000,
    consignment: 800,
    returnStock: 120,
    total: 11420
  },
  {
    materialId: 'STD-FRAME-001',
    materialName: '标准框架',
    factoryStock: 12000,
    inTransit: 3500,
    consignment: 0,
    returnStock: 200,
    total: 15700
  },
  {
    materialId: 'IMP-ELECTRONIC',
    materialName: '进口电子件',
    factoryStock: 3200,
    inTransit: 800,
    consignment: 1500,
    returnStock: 0,
    total: 5500
  }
];

// ==================== 异常相关 ====================

export const mockExceptions = [
  {
    id: 'EXC-001',
    type: 'SHORTAGE',
    title: '医养电机缺料预警',
    materialId: 'MED-MOTOR-001',
    materialName: '医养电机',
    quantity: -500,
    priorityScore: 95,
    priorityLevel: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-02-14 08:00',
    assignedTo: null
  },
  {
    id: 'EXC-002',
    type: 'DELAY',
    title: '供应商延期提醒',
    supplierId: 'SUP-DE-001',
    supplierName: '青岛电机有限公司',
    delayDays: 3,
    priorityScore: 78,
    priorityLevel: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-02-14 07:30',
    assignedTo: null
  },
  {
    id: 'EXC-003',
    type: 'QUALITY',
    title: '来料质量异常',
    materialId: 'MED-CONTROL-001',
    materialName: '控制模块',
    defectRate: 2.5,
    priorityScore: 88,
    priorityLevel: 'HIGH',
    status: 'PROCESSING',
    createdAt: '2026-02-13 16:00',
    assignedTo: 'USER-001'
  }
];

// ==================== 绩效相关 ====================

export const mockPerformance = {
  otdRate: 96.5,
  qualityRate: 98.2,
  responseScore: 4.5,
  totalOrders: 156,
  totalAmount: 1285000,
  monthlyTrend: [
    { month: '2025-09', otd: 94.2, quality: 97.5 },
    { month: '2025-10', otd: 95.1, quality: 98.0 },
    { month: '2025-11', otd: 96.8, quality: 98.5 },
    { month: '2025-12', otd: 96.5, quality: 98.2 }
  ]
};

// ==================== Mock API 函数 ====================

export const mockAPI = {
  // 供应商PO列表
  async getPurchaseOrders(supplierId) {
    await delay(MOCK_DELAY);
    return mockPurchaseOrders.filter(
      o => !supplierId || o.supplierId === supplierId
    );
  },

  // 供应商绩效
  async getSupplierPerformance(supplierId) {
    await delay(MOCK_DELAY);
    return mockPerformance;
  },

  // 库存列表
  async getInventory() {
    await delay(MOCK_DELAY);
    return mockInventory;
  },

  // 异常列表
  async getExceptions() {
    await delay(MOCK_DELAY);
    return mockExceptions;
  },

  // ATP计算
  async calculateATP(materialId, requestedQty) {
    await delay(MOCK_DELAY);
    const item = mockInventory.find(i => i.materialId === materialId);
    const available = item ? item.factoryStock : 5000;
    const atp = available - requestedQty;
    
    return {
      materialId,
      requestedQty,
      availableStock: available,
      atpQuantity: Math.max(0, atp),
      canFulfill: atp >= 0,
      confidence: 0.92
    };
  },

  // 供应商认证
  async authenticate(code, password) {
    await delay(MOCK_DELAY);
    
    if (code === 'SUP001' && password === '123456') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        supplierId: 'SUP-DE-001',
        supplierName: '青岛电机有限公司',
        level: 'A'
      };
    }
    
    return {
      success: false,
      error: '用户名或密码错误'
    };
  },

  // GenAI查询
  async aiQuery(query) {
    await delay(MOCK_DELAY);
    
    const lower = query.toLowerCase();
    let response;
    
    if (lower.includes('缺料')) {
      response = {
        answer: '发现3个高风险缺料物料：医养电机缺500件，控制模块缺200件，标准框架缺1000件',
        data: mockInventory,
        confidence: 0.92,
        factors: ['历史数据分析', '在途库存计算', '需求预测'],
        suggestions: ['建议紧急补货', '联系供应商确认交期', '考虑替代物料']
      };
    } else if (lower.includes('绩效')) {
      response = {
        answer: '供应商绩效优秀，OTD率96.5%，质量合格率98.2%',
        data: mockPerformance,
        confidence: 0.95,
        factors: ['历史交付数据', '质检记录', '响应时间'],
        suggestions: ['继续保持', '关注准时交货率提升']
      };
    } else {
      response = {
        answer: '已收到您的查询，正在处理...',
        confidence: 0.80,
        factors: ['基于当前数据'],
        suggestions: ['请提供更详细的查询条件']
      };
    }
    
    return response;
  }
};

// 辅助函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default mockAPI;
