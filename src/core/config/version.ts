/**
 * HJ SCM 版本配置
 * 遵循语义化版本规范：主版本.次版本.修订版本
 * 
 * 版本历史：
 * - v3.0: 基础版本 (2026-01)
 * - v3.1: ISC框架整合 (2026-02-14)
 * - v3.2: 菜单重构 + 风险监控 + 战略管理 (2026-02-18)
 * - v3.3: 国际化支持 + 异常工作台 + 修复 (2026-02-19)
 */
export const APP_VERSION = {
  major: 3,
  minor: 3,
  patch: 0,
  suffix: '', // 可选后缀: 'alpha', 'beta', 'rc1', etc.
  
  // 完整版本字符串
  get full(): string {
    return `v${this.major}.${this.minor}.${this.patch}${this.suffix ? '-' + this.suffix : ''}`;
  },
  
  // 显示版本（含类型标识）
  get display(): string {
    return `${this.full} 演示版`;
  },
  
  // 版本发布日期
  releaseDate: '2026-02-19',
  
  // 构建信息
  build: {
    number: Date.now(),
    date: new Date().toISOString().split('T')[0],
  },
};

/**
 * 变更日志
 */
export const CHANGELOG = [
  {
    version: '3.3.0',
    date: '2026-02-19',
    changes: [
      '添加国际化支持 (中/英文)',
      '新增异常工作台模块',
      '修复 Vite dev server 编译问题',
      '优化 Select 组件导出兼容性',
      '新增战略管理子页面 (网络/产能/产品/财务)',
    ],
  },
  {
    version: '3.2.0',
    date: '2026-02-18',
    changes: [
      '菜单重构 (SCOR结构)',
      '新增风险监控菜单 (三道防线)',
      '新增价值金字塔菜单',
      'ISC框架整合',
    ],
  },
];

export default APP_VERSION;
