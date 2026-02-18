export interface NetworkNode {
  id: string;
  name: string;
  location: string;
  type: 'factory' | 'dc' | 'warehouse';
  utilization: number;
  cost: string;
  capacity: number;
}

export interface NetworkOptimization {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  cost: string;
  roi: string;
}

export interface NetworkStats {
  totalNodes: number;
  averageUtilization: number;
  totalCost: string;
  coverage: number;
}

export interface RiskAlert {
  id: string;
  type: 'logistics' | 'capacity' | 'supply' | 'policy';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
}
