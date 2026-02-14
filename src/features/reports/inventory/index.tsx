import React from 'react';
import { 
  Package, TrendingDown, AlertTriangle, RefreshCw,
  Download, BarChart3, PieChart
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 库存报表模块
 */
export default function InventoryReport() {
  const mockData = {
    turnover: { rate: 12.5, trend: '+0.8' },
    stagnation: { high: 5, medium: 15 },
    ageDistribution: [
      { range: '0-30天', count: 4500, pct: 45 },
      { range: '31-60天', count: 2800, pct: 28 },
      { range: '61-90天', count: 1500, pct: 15 },
      { range: '>90天', count: 1200, pct: 12 }
    ],
    batchMetrics: { tracked: 89, untracked: 11 }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">库存报表</h1>
      
      {/* 指标卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 border-blue-500/30">
          <Package className="w-8 h-8 text-blue-400 mb-4"/>
          <p className="text-gray-400 text-sm">库存周转</p>
          <p className="text-3xl font-bold text-white">{mockData.turnover.rate}次</p>
          <p className="text-green-400 text-sm">{mockData.turnover.trend}</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-amber-500/20 border-amber-500/30">
          <AlertTriangle className="w-8 h-8 text-amber-400 mb-4"/>
          <p className="text-gray-400 text-sm">呆滞物料</p>
          <p className="text-3xl font-bold text-white">{mockData.stagnation.high + mockData.stagnation.medium}</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 border-purple-500/30">
          <BarChart3 className="w-8 h-8 text-purple-400 mb-4"/>
          <p className="text-gray-400 text-sm">库龄分布</p>
          <p className="text-3xl font-bold text-white">4组</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-500/20 border-green-500/30">
          <TrendingDown className="w-8 h-8 text-green-400 mb-4"/>
          <p className="text-gray-400 text-sm">追溯率</p>
          <p className="text-3xl font-bold text-white">{mockData.batchMetrics.tracked}%</p>
        </Card>
      </div>
      
      {/* 库龄分布 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">库龄分布</h3>
        <div className="grid grid-cols-4 gap-4">
          {mockData.ageDistribution.map((item, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm">{item.range}</p>
              <p className="text-2xl font-bold text-white">{item.count.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">{item.pct}%</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* 库存报表导出 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">报表导出</h3>
        <div className="grid grid-cols-3 gap-4">
          {['库存余额表', '批次追溯表', '呆滞明细表'].map((name, i) => (
            <Button key={i} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2"/>
              {name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
