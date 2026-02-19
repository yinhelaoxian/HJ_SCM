import axios from 'axios';

// Network types
import { 
  NetworkNode, 
  NetworkOptimization, 
  NetworkStats, 
  RiskAlert 
} from '@/features/strategy/network/types';

// Capacity types
import { 
  CapacityData,
  CapacityOptimization,
  CapacityForecast
} from '@/features/strategy/capacity/types';

// Portfolio types
import {
  PortfolioItem,
  PortfolioOptimization
} from '@/features/strategy/portfolio/types';

// Financial types
import {
  FinancialMetric,
  FinancialProjection,
  FinancialConstraint
} from '@/features/strategy/financial/types';

const api = axios.create({
  baseURL: '/api/strategy',
  timeout: 10000,
});

/**
 * 获取网络规划数据
 * 包含节点信息、优化建议、统计信息和风险预警
 */
export async function getNetworkData(): Promise<{
  nodes: NetworkNode[];
  optimizations: NetworkOptimization[];
  stats: NetworkStats;
  risks: RiskAlert[];
}> {
  try {
    const response = await api.get('/network');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch network data:', error);
    throw error;
  }
}

/**
 * 获取产能规划数据
 * 包含产能数据、优化建议和预测
 */
export async function getCapacityData(): Promise<{
  data: CapacityData[];
  optimizations: CapacityOptimization[];
  forecasts: CapacityForecast[];
}> {
  try {
    const response = await api.get('/capacity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch capacity data:', error);
    throw error;
  }
}

/**
 * 获取产品组合数据
 * 包含产品项和组合优化建议
 */
export async function getPortfolioData(): Promise<{
  items: PortfolioItem[];
  optimizations: PortfolioOptimization[];
}> {
  try {
    const response = await api.get('/portfolio');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    throw error;
  }
}

/**
 * 获取财务约束数据
 * 包含财务指标、预测和约束条件
 */
export async function getFinancialData(): Promise<{
  metrics: FinancialMetric[];
  projections: FinancialProjection[];
  constraints: FinancialConstraint[];
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
