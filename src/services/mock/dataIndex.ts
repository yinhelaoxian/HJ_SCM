/**
 * Mock 数据统一索引
 * 
 * 目的：统一两套 Mock 数据源，消除命名不一致
 * 
 * 数据源：
 * - mock.data.ts: 演示数据（面向客户展示）
 * - mockAPI.ts: 开发数据（面向前端开发）
 * 
 * 使用方式：
 * import { suppliers, materials } from './dataIndex';
 */

// 供应商数据统一命名规范
export const SUPPLIERS = {
  // 德国供应商
  BUHLER: {
    id: 'SUP-DE-001',
    code: 'SUP-DE-001',
    name: 'Bühler Motor GmbH',
    nameCn: '德国布尔电机',
    country: 'DE',
    region: 'EMEA',
    level: 'A',
    isKeySupplier: true,
  },
  // 中国供应商
  SUZHOU_JINGQU: {
    id: 'SUP-CN-012',
    code: 'SUP-CN-012',
    name: 'Suzhou Jingqu Technology',
    nameCn: '苏州精驱科技',
    country: 'CN',
    region: 'APAC',
    level: 'A',
    isKeySupplier: true,
  },
  // 泰国供应商
  THAI_TECH: {
    id: 'SUP-TH-007',
    code: 'SUP-TH-007',
    name: 'Thai Tech Manufacturing',
    nameCn: '泰国科技制造',
    country: 'TH',
    region: 'APAC',
    level: 'B',
    isKeySupplier: false,
  },
};

// 物料数据统一命名规范
export const MATERIALS = {
  // 线性推杆
  HJ_LA23: {
    code: 'MAT-LA23',
    name: 'HJ-LA23 线性推杆',
    nameCn: 'HJ-LA23 线性推杆',
    type: 'FERT',
    unit: 'PCS',
  },
  // 电机
  HJ_M15: {
    code: 'MAT-M15',
    name: 'HJ-M15 电机',
    nameCn: 'HJ-M15 电机',
    type: 'FERT',
    unit: 'PCS',
  },
};

// 工厂数据统一命名规范
export const PLANTS = {
  QINGDAO: {
    code: 'PLA-001',
    name: '青岛工厂',
    region: 'NORTH_CHINA',
  },
  SUZHOU: {
    code: 'PLA-002',
    name: '苏州工厂',
    region: 'EAST_CHINA',
  },
  THAILAND: {
    code: 'PLA-003',
    name: '泰国工厂',
    region: 'SE_ASIA',
  },
};

/**
 * 快速查找供应商
 */
export function findSupplier(idOrCode: string) {
  return Object.values(SUPPLIERS).find(
    s => s.id === idOrCode || s.code === idOrCode
  );
}

/**
 * 快速查找物料
 */
export function findMaterial(idOrCode: string) {
  return Object.values(MATERIALS).find(
    m => m.code === idOrCode
  );
}
