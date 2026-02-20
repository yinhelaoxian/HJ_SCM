// Financial types for external use

export interface FilterOptions {
  budgetStatus: 'all' | 'used' | 'remaining';
  expenseType: 'all' | 'equipment' | 'labor' | 'logistics' | 'rd';
  quarter: 'all' | 'q1' | 'q2' | 'q3' | 'q4';
  search: string;
}

export interface FinancialStats {
  totalBudget: string;
  usedBudget: string;
  pendingInvestment: string;
  budgetUtilization: number;
  costSavings: string;
  investmentConstraints: number;
  riskLevel: string;
}

export interface BudgetItem {
  id: number;
  name: string;
  budget: string;
  used: string;
  utilization: number;
  trend: number;
  type: 'equipment' | 'labor' | 'logistics' | 'rd';
  quarter: string;
  status: 'used' | 'remaining';
}

export interface InvestmentConstraint {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

export interface FinancialRisk {
  id: number;
  type: string;
  title: string;
  description: string;
  severity: 'danger' | 'warning' | 'info';
  suggestion: string;
}

export interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  status: 'over' | 'under' | 'on-track';
}

export interface FinancialProjection {
  period: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface FinancialConstraint {
  id: string;
  type: 'budget' | 'capacity' | 'resource';
  limit: number;
  used: number;
  remaining: number;
  unit: string;
}
