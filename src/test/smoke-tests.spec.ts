/**
 * Sprint 4 测试用例模板
 * 
 * 测试结构：
 * - API测试
 * - E2E测试
 * - 性能测试
 */

// ==================== API测试 ====================
// API测试：Jest + Supertest
describe('API测试', () => {
  describe('物料管理', () => {
    test('创建物料', async () => {
      const res = await request(app).post('/api/v1/materials')
        .send({ materialCode: 'MED-001', materialName: '测试物料' });
      expect(res.status).toBe(201);
    });
    
    test('查询物料列表', async () => {
      const res = await request(app).get('/api/v1/materials');
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
  
  describe('质量检查', () => {
    test('完整性检查', async () => {
      const res = await request(app).post('/api/v1/quality/check');
      expect(res.body.score).toBeGreaterThan(0);
    });
  });
});

// ==================== E2E测试 ====================
// Playwright配置
// npx playwright test --reporter=line

// ==================== 冒烟测试 ====================
// 冒烟测试清单
const smokeTests = [
  { page: '首页', checks: ['加载', '渲染', '交互'] },
  { page: '仪表盘', checks: ['KPI卡片', '图表', '导航'] },
  { page: '报表', checks: ['列表', '导出', '筛选'] }
];
