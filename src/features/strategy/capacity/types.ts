// Capacity types for external use

export interface CapacityData {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: string;
  utilization: number;
  cost: string;
  status: 'overloaded' | 'normal' | 'underloaded';
}

export interface CapacityOptimization {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  cost: string;
  roi: string;
}

export interface CapacityForecast {
  period: string;
  utilization: number;
  demand: number;
  capacity: number;
}

export interface FilterOptions {
  type: 'all' | 'factory' | 'assembly';
  location: 'all' | 'qingdao' | 'su' | 'thailand' | 'north';
  sortUtilization: 'none' | 'high' | 'low';
  search: string;
}
