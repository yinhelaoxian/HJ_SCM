// 组合优化类型定义
export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  margin: number;
  risk: 'high' | 'medium' | 'low';
  revenue: string;
  cost: string;
  profit: string;
  trend: 'up' | 'down' | 'stable';
  sales?: string;
  growth?: number;
}

export interface PortfolioOptimization {
  id: string;
  title: string;
  description: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'approved' | 'implemented';
}

export interface PortfolioRecommendation {
  id: string;
  type: 'expand' | 'maintain' | 'reduce' | 'exit';
  productName: string;
  reason: string;
  expectedImpact: string;
}
