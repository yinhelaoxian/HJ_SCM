import axios from 'axios';
import type { 
  NetworkNode, 
  NetworkOptimization, 
  NetworkStats, 
  RiskAlert,
  CapacityData,
  CapacityOptimization,
  CapacityForecast,
  PortfolioItem,
  PortfolioOptimization,
  FinancialMetric,
  FinancialProjection,
  FinancialConstraint
} from '@/features/strategy/types';

// Network types are also imported from individual modules
import { 
  NetworkNode as NetworkNodeType, 
  NetworkOptimization as NetworkOptimizationType, 
  NetworkStats as NetworkStatsType, 
  RiskAlert as RiskAlertType 
} from '@/features/strategy/network/types';
import { 
  CapacityData as CapacityDataType,
  CapacityOptimization as CapacityOptimizationType,
  CapacityForecast as CapacityForecastType
} from '@/features/strategy/capacity/types';
import {
  PortfolioItem as PortfolioItemType,
  PortfolioOptimization as PortfolioOptimizationType
} from '@/features/strategy/portfolio/types';
import {
  FinancialMetric as FinancialMetricType,
  FinancialProjection as FinancialProjectionType,
  FinancialConstraint as FinancialConstraintType
} from '@/features/strategy/financial/types';

const api = axios.create({
  baseURL: '/api/strategy',
  timeout: 10000,
});

// Network API
export async function getNetworkData(): Promise<{
  nodes: NetworkNodeType[];
  optimizations: NetworkOptimizationType[];
  stats: NetworkStatsType;
  risks: RiskAlertType[];
}> {
  try {
    const response = await api.get('/network');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch network data:', error);
    throw error;
  }
}

// Capacity API
export async function getCapacityData(): Promise<{
  data: CapacityDataType[];
  optimizations: CapacityOptimizationType[];
  forecasts: CapacityForecastType[];
}> {
  try {
    const response = await api.get('/capacity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch capacity data:', error);
    throw error;
  }
}

// Portfolio API
export async function getPortfolioData(): Promise<{
  items: PortfolioItemType[];
  optimizations: PortfolioOptimizationType[];
}> {
  try {
    const response = await api.get('/portfolio');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    throw error;
  }
}

// Financial API
export async function getFinancialData(): Promise<{
  metrics: FinancialMetricType[];
  projections: FinancialProjectionType[];
  constraints: FinancialConstraintType[];
}> {
  try {
    const response = await api.get('/financial');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch financial data:', error);
    throw error;
  }
}

export default {
  getNetworkData,
  getCapacityData,
  getPortfolioData,
  getFinancialData,
};
