import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Calendar, Download, RefreshCw,
  Target, AlertTriangle, Filter, Settings
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 需求预测工作台
 *
 * 功能：
 * - 13周滚动预测
 * - 季节性分解展示
 * - 置信区间可视化
 * - 异常检测标记
 */
export default function DemandForecastWorkbench() {
  const [selectedMaterial, setSelectedMaterial] = useState('MED-MOTOR-001');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('chart');

  // 模拟预测数据
  const mockForecastData = {
    materialId: 'MED-MOTOR-001',
    materialName: '医养电机',
    accuracy: 0.87,
    trendFactor: 1.02,
    forecasts: [
      { week: 'W1', date: '2026-02-21', quantity: 520, lower: 450, upper: 590 },
      { week: 'W2', date: '2026-02-28', quantity: 580, lower: 500, upper: 660 },
      { week: 'W3', date: '2026-03-07', quantity: 650, lower: 560, upper: 740 },
      { week: 'W4', date: '2026-03-14', quantity: 720, lower: 620, upper: 820 },
      { week: 'W5', date: '2026-03-21', quantity: 680, lower: 580, upper: 780 },
      { week: 'W6', date: '2026-03-28', quantity: 620, lower: 520, upper: 720 },
      { week: 'W7', date: '2026-04-04', quantity: 580, lower: 480, upper: 680 },
      { week: 'W8', date: '2026-04-11', quantity: 520, lower: 420, upper: 620 },
      { week: 'W9', date: '2026-04-18', quantity: 480, lower: 380, upper: 580 },
      { week: 'W10', date: '2026-04-25', quantity: 420, lower: 320, upper: 520 },
      { week: 'W11', date: '2026-05-02', quantity: 450, lower: 350, upper: 550 },
      { week: 'W12', date: '2026-05-09', quantity: 490, lower: 390, upper: 590 },
      { week: 'W13', date: '2026-05-16', quantity: 550, lower: 450, upper: 650 },
    ],
    seasonalFactors: {
      'W1': 1.0, 'W2': 1.1, 'W3': 1.2, 'W4': 1.3, 'W5': 1.2,
      'W6': 1.1, 'W7': 1.0, 'W8': 0.9, 'W9': 0.8, 'W10': 0.7,
      'W11': 0.8, 'W12': 0.9, 'W13': 1.0
    },
    anomalies: [
      { date: '2026-01-15', type: 'HIGH', quantity: 850, severity: 'HIGH' }
    ]
  };

  // 趋势数据
  const trendData = [
    { month: '2025-09', actual: 480, forecast: null },
    { month: '2025-10', actual: 520, forecast: null },
    { month: '2025-11', actual: 580, forecast: null },
    { month: '2025-12', actual: 650, forecast: null },
    { month: '2026-01', actual: null, forecast: 620 },
    { month: '2026-02', actual: null, forecast: 680 },
    { month: '2026-03', actual: null, forecast: 720 },
    { month: '2026-04', actual: null, forecast: 680 },
  ];

  const handleForecast = useCallback(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setForecastData(mockForecastData);
      setLoading(false);
    }, 1000);
  }, []);

  const chartData = forecastData ? forecastData.forecasts.map(f => ({
    week: f.week,
    date: f.date,
    quantity: f.quantity,
    lower: f.lower,
    upper: f.upper,
    anomaly: forecastData.anomalies.find(a => a.date === f.date)
  })) : [];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">需求预测工作台</h1>
          <p className="text-gray-400 mt-1">ML预测模型 · 13周滚动计划</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleForecast} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新预测
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* 物料选择器 */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">选择物料</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="MED-MOTOR-001">MED-MOTOR-001 - 医养电机</option>
              <option value="MED-CONTROL-001">MED-CONTROL-001 - 控制模块</option>
              <option value="IMP-ELECTRONIC">IMP-ELECTRONIC - 进口电子件</option>
            </select>
          </div>
          <div className="flex gap-2 pt-6">
            <Button variant={viewMode === 'chart' ? 'primary' : 'ghost'} size="sm"
              onClick={() => setViewMode('chart')}>
              图表
            </Button>
            <Button variant={viewMode === 'table' ? 'primary' : 'ghost'} size="sm"
              onClick={() => setViewMode('table')}>
              表格
            </Button>
          </div>
        </div>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">预测准确率</p>
              <p className="text-3xl font-bold text-white">87%</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-green-400 text-sm mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            较上月+3%
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">趋势因子</p>
              <p className="text-3xl font-bold text-white">+2%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mt-2">周环比增长</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">季节峰值</p>
              <p className="text-3xl font-bold text-white">W4</p>
            </div>
            <Calendar className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-gray-400 text-sm mt-2">预计3月中旬达峰</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">异常检测</p>
              <p className="text-3xl font-bold text-white">{forecastData?.anomalies?.length || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-400 text-sm mt-2">需关注</p>
        </Card>
      </div>

      {/* 预测图表 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">13周滚动预测</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Legend />
            
            {/* 置信区间 */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#3B82F6"
              fillOpacity={0.1}
              name="置信区间上限"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#1F2937"
              fillOpacity={0.5}
              name="置信区间下限"
            />
            
            {/* 预测线 */}
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name="预测值"
            />
            
            {/* 异常标记 */}
            {chartData.filter(d => d.anomaly).map((d, i) => (
              <ReferenceLine
                key={i}
                x={d.week}
                stroke="#EF4444"
                strokeDasharray="5 5"
                label={{
                  value: '⚠️',
                  position: 'top',
                  fill: '#EF4444'
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* 预测明细表格 */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">预测明细</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">周次</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日期</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">预测量</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">置信区间</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">置信度</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {chartData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white font-medium">{row.week}</td>
                <td className="px-4 py-3 text-gray-400">{row.date}</td>
                <td className="px-4 py-3 text-right font-semibold text-white">
                  {row.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  [{row.lower.toLocaleString()} - {row.upper.toLocaleString()}]
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={row.quantity > 600 ? 'warning' : 'default'}>
                    {Math.round((95 - i * 3)}%
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  {row.anomaly ? (
                    <Badge variant="danger">异常</Badge>
                  ) : (
                    <Badge variant="success">正常</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 季节性因子 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">季节性因子</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(forecastData?.seasonalFactors || {}).map(([week, factor]) => (
            <div
              key={week}
              className={`px-3 py-2 rounded-lg text-sm ${
                factor > 1.0 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : factor < 1.0 
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-gray-700 text-gray-300'
              }`}
            >
              <span className="font-medium">{week}</span>
              <span className="ml-2">
                {factor > 1 ? '+' : ''}{(factor - 1) * 100}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
