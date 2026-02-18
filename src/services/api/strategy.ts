import { NetworkNode, NetworkOptimization, NetworkStats } from '@/features/strategy/network/types';

/**
 * 从 API 获取网络规划数据
 */
export async function fetchNetworkData(): Promise<{
  nodes: NetworkNode[];
  optimizations: NetworkOptimization[];
  stats: NetworkStats;
}> {
  const response = await fetch('/api/strategy/network');
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
