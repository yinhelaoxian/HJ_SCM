// 通用类型定义
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 供应链类型
export interface Supplier {
  id: string;
  name: string;
  country: string;
  flag: string;
  category: string;
  riskScore: number;
  riskLevel: 'critical' | 'warning' | 'normal';
  otd: number;
  keyMaterials: string[];
  riskFactors: string[];
  radar: {
    financial: number;
    delivery: number;
    quality: number;
    geopolitical: number;
    concentration: number;
    compliance: number;
  };
}

export interface Order {
  id: string;
  customer: string;
  customerCountry: string;
  flag: string;
  material: string;
  qty: number;
  amount: number;
  originalDeliveryDate: string;
  requestedDeliveryDate: string;
  status: 'confirmed' | 'at_risk' | 'normal';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'normal';
  title: string;
  amount: string;
  deadline: string;
}

export interface KPI {
  label: string;
  current: number;
  target: number;
  unit: string;
  status: 'danger' | 'warning' | 'success';
}

export interface Plant {
  name: string;
  status: 'overload' | 'normal' | 'ramping';
  utilization: number;
  risk: string;
}

export interface PlanScenario {
  id: string;
  label: string;
  color: string;
}

export interface RiskFactor {
  name: string;
  weight: number;
}
