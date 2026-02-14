import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Package, AlertTriangle, TrendingDown, RefreshCw,
  Search, Filter, Download, ChevronDown
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 库存工作台页面
 * 
 * 功能：
 * - 多级库存视图（工厂仓/在途/寄售/退回）
 * - 批次追踪入口
 * - ATP计算展示
 * - 呆滞预警
 */
export default function InventoryWorkbench() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [stagnationData, setStagnationData] = useState([]);
  
  // 模拟数据
  const mockInventoryData = [
    { materialId: 'MED-MOTOR-001', name: '医养电机', factory: 5200, inTransit: 1200, consignment: 300, return: 50, total: 6750 },
    { materialId: 'MED-CONTROL-001', name: '控制模块', factory: 8500, inTransit: 2000, consignment: 800, return: 120, total: 11420 },
    { materialId: 'STD-FRAME-001', name: '标准框架', factory: 12000, inTransit: 3500, consignment: 0, return: 200, total: 15700 },
    { materialId: 'IMP-ELECTRONIC', name: '进口电子件', factory: 3200, inTransit: 800, consignment: 1500, return: 0, total: 5500 },
  ];
  
  const mockStagnationData = [
    { materialId: 'OLD-MOTOR-001', name: '老款电机', batch: 'B20250101', quantity: 1200, daysInStock: 120, turnoverRate: 0.5, riskLevel: 'HIGH', riskScore: 85 },
    { materialId: 'STD-CABLE-001', name: '标准电缆', batch: 'B20241215', quantity: 3500, daysInStock: 95, turnoverRate: 0.8, riskLevel: 'MEDIUM', riskScore: 55 },
  ];
  
  const mockATPData = [
    { material: 'MED-MOTOR-001', requested: 500, available: 5200, atp: 5200, canFulfill: true },
    { material: 'MED-CONTROL-001', requested: 800, available: 8500, atp: 8500, canFulfill: true },
    { material: 'IMP-ELECTRONIC', requested: 2000, available: 3200, atp: 3200, canFulfill: true },
  ];

  // 库存概览图表数据
  const overviewChartData = mockInventoryData.map(item => ({
    name: item.name,
    工厂仓: item.factory,
    在途: item.inTransit,
    寄售: item.consignment,
  }));
  
  // 呆滞分布饼图数据
  const stagnationPieData = [
    { name: '高风险', value: 1, color: '#DC2626' },
    { name: '中风险', value: 1, color: '#D97706' },
    { name: '低风险', value: 0, color: '#059669' },
  ];

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = () => {
    // 导出逻辑
    console.log('导出库存数据');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">库存工作台</h1>
          <p className="text-gray-400 mt-1">多级库存视图 · 批次追踪 · ATP计算 · 呆滞预警</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex border-b border-gray-700">
        {[
          { key: 'overview', label: '库存概览' },
          { key: 'atp', label: 'ATP计算' },
          { key: 'stagnation', label: '呆滞预警' },
          { key: 'trace', label: '批次追溯' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab内容 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">总库存量</p>
                  <p className="text-2xl font-bold text-white">39,370</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">在途库存</p>
                  <p className="text-2xl font-bold text-white">7,500</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-gray-400 text-sm">呆滞物料</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">医养批次</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 库存图表 */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">多级库存分布</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={overviewChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F9FAFB' }}
                  />
                  <Legend />
                  <Bar dataKey="工厂仓" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="在途" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="寄售" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">呆滞分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stagnationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stagnationPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {stagnationPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 库存明细表格 */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">库存明细</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索物料..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">物料编码</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">物料名称</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">工厂仓</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">在途</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">寄售</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">退回</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">合计</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockInventoryData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-white font-mono text-sm">{item.materialId}</td>
                    <td className="px-4 py-3 text-gray-300">{item.name}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{item.factory.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{item.inTransit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{item.consignment.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{item.return.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">{item.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">
                        追溯
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === 'atp' && (
        <ATPCalculationPanel data={mockATPData} />
      )}

      {activeTab === 'stagnation' && (
        <StagnationAlertPanel data={mockStagnationData} />
      )}

      {activeTab === 'trace' && (
        <BatchTracePanel />
      )}
    </div>
  );
}

/**
 * ATP计算面板
 */
function ATPCalculationPanel({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">ATP计算结果</h3>
      <table className="w-full">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">物料</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">请求量</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">可用库存</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">ATP</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">能否履约</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3 text-white font-mono text-sm">{item.material}</td>
              <td className="px-4 py-3 text-right text-gray-300">{item.requested.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-300">{item.available.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-semibold text-green-400">{item.atp.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <Badge variant={item.canFulfill ? 'success' : 'danger'}>
                  {item.canFulfill ? '可履约' : '无法履约'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/**
 * 呆滞预警面板
 */
function StagnationAlertPanel({ data }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/5 border-red-500/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">高风险呆滞物料预警</p>
            <p className="text-gray-400 text-sm">建议优先处理，降低库存成本</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">物料编码</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">批次号</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">数量</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">库龄(天)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">周转率</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">风险等级</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">风险评分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 text-white font-mono text-sm">{item.materialId}</td>
                <td className="px-4 py-3 text-gray-300">{item.batch}</td>
                <td className="px-4 py-3 text-right text-gray-300">{item.quantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-amber-400">{item.daysInStock}</td>
                <td className="px-4 py-3 text-right text-gray-300">{item.turnoverRate}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(item.riskLevel)}`}>
                    {item.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.riskScore > 70 ? 'bg-red-500' : item.riskScore > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${item.riskScore}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">{item.riskScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/**
 * 批次追溯面板
 */
function BatchTracePanel() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">批次追溯查询</h3>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="输入批次号/Trace ID..."
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
        <Button>
          <Search className="w-4 h-4 mr-2" />
          查询
        </Button>
      </div>
      <div className="text-center text-gray-400 py-12">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <p>输入批次号或Trace ID进行追溯查询</p>
      </div>
    </Card>
  );
}
