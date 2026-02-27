// MTS策略页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Package, TrendingUp, TrendingDown, Activity, AlertTriangle, Search, Filter, Download, RefreshCw } from 'lucide-react';

// 类型定义
interface MTSStrategy {
  id: number;
  product: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  maxStock: number;
  leadTime: number;
  forecastDemand: number;
  actualSales: number;
  fillRate: number;
  stockTurnover: number;
  status: 'optimal' | 'warning' | 'critical';
}

interface ProductionPlan {
  id: number;
  product: string;
  planQuantity: number;
  actualQuantity: number;
  productionDate: string;
  efficiency: number;
  status: 'completed' | 'in-progress' | 'pending';
}

// 模拟数据
const mtsStrategies: MTSStrategy[] = [
  { id: 1, product: '智能手机 X1', category: '电子产品', currentStock: 125, safetyStock: 80, reorderPoint: 100, maxStock: 200, leadTime: 7, forecastDemand: 150, actualSales: 135, fillRate: 95.5, stockTurnover: 8.2, status: 'optimal' },
  { id: 2, product: '笔记本电脑 Pro', category: '电子产品', currentStock: 45, safetyStock: 50, reorderPoint: 70, maxStock: 150, leadTime: 14, forecastDemand: 80, actualSales: 75, fillRate: 98.2, stockTurnover: 6.8, status: 'warning' },
  { id: 3, product: '智能手表 S3', category: '可穿戴设备', currentStock: 85, safetyStock: 40, reorderPoint: 60, maxStock: 120, leadTime: 10, forecastDemand: 100, actualSales: 95, fillRate: 92.3, stockTurnover: 9.5, status: 'optimal' },
  { id: 4, product: '平板电脑 Tab', category: '电子产品', currentStock: 35, safetyStock: 40, reorderPoint: 50, maxStock: 100, leadTime: 12, forecastDemand: 60, actualSales: 55, fillRate: 88.9, stockTurnover: 7.3, status: 'critical' },
  { id: 5, product: '无线耳机 Air', category: '音频设备', currentStock: 150, safetyStock: 60, reorderPoint: 80, maxStock: 250, leadTime: 8, forecastDemand: 180, actualSales: 165, fillRate: 93.8, stockTurnover: 10.2, status: 'optimal' },
];

const productionPlans: ProductionPlan[] = [
  { id: 1, product: '智能手机 X1', planQuantity: 200, actualQuantity: 195, productionDate: '2026-02-25', efficiency: 97.5, status: 'completed' },
  { id: 2, product: '笔记本电脑 Pro', planQuantity: 100, actualQuantity: 85, productionDate: '2026-02-26', efficiency: 85.0, status: 'completed' },
  { id: 3, product: '智能手表 S3', planQuantity: 150, actualQuantity: 142, productionDate: '2026-02-27', efficiency: 94.7, status: 'in-progress' },
  { id: 4, product: '平板电脑 Tab', planQuantity: 80, actualQuantity: 0, productionDate: '2026-02-28', efficiency: 0, status: 'pending' },
];

const chartData = {
  stockLevelTrend: [
    { date: '2026-02-20', X1: 145, Pro: 55, S3: 75, Tab: 45, Air: 135 },
    { date: '2026-02-21', X1: 138, Pro: 52, S3: 80, Tab: 43, Air: 142 },
    { date: '2026-02-22', X1: 142, Pro: 48, S3: 78, Tab: 40, Air: 138 },
    { date: '2026-02-23', X1: 135, Pro: 46, S3: 82, Tab: 38, Air: 145 },
    { date: '2026-02-24', X1: 130, Pro: 47, S3: 83, Tab: 36, Air: 150 },
    { date: '2026-02-25', X1: 125, Pro: 45, S3: 85, Tab: 35, Air: 150 },
  ],
  demandForecast: [
    { product: '智能手机 X1', forecast: 150, actual: 135 },
    { product: '笔记本电脑 Pro', forecast: 80, actual: 75 },
    { product: '智能手表 S3', forecast: 100, actual: 95 },
    { product: '平板电脑 Tab', forecast: 60, actual: 55 },
    { product: '无线耳机 Air', forecast: 180, actual: 165 },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function InventoryMTSPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStockLevelTrendOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: '#b0bec5', fontSize: 10 },
    },
    xAxis: {
      type: 'category',
      data: chartData.stockLevelTrend.map(item => item.date),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '智能手机 X1',
        type: 'line',
        data: chartData.stockLevelTrend.map(item => item.X1),
        smooth: true,
        lineStyle: { color: colors.cyan, width: 2 },
        itemStyle: { color: colors.cyan },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,180,216,0.3)' },
              { offset: 1, color: 'rgba(0,180,216,0.0)' },
            ],
          },
        },
      },
      {
        name: '笔记本电脑 Pro',
        type: 'line',
        data: chartData.stockLevelTrend.map(item => item.Pro),
        smooth: true,
        lineStyle: { color: colors.orange, width: 2 },
        itemStyle: { color: colors.orange },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245,124,0,0.3)' },
              { offset: 1, color: 'rgba(245,124,0,0.0)' },
            ],
          },
        },
      },
      {
        name: '智能手表 S3',
        type: 'line',
        data: chartData.stockLevelTrend.map(item => item.S3),
        smooth: true,
        lineStyle: { color: '#00897b', width: 2 },
        itemStyle: { color: '#00897b' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,137,123,0.3)' },
              { offset: 1, color: 'rgba(0,137,123,0.0)' },
            ],
          },
        },
      },
      {
        name: '平板电脑 Tab',
        type: 'line',
        data: chartData.stockLevelTrend.map(item => item.Tab),
        smooth: true,
        lineStyle: { color: '#e53935', width: 2 },
        itemStyle: { color: '#e53935' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(229,57,53,0.3)' },
              { offset: 1, color: 'rgba(229,57,53,0.0)' },
            ],
          },
        },
      },
      {
        name: '无线耳机 Air',
        type: 'line',
        data: chartData.stockLevelTrend.map(item => item.Air),
        smooth: true,
        lineStyle: { color: '#7a8ba8', width: 2 },
        itemStyle: { color: '#7a8ba8' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(122,139,168,0.3)' },
              { offset: 1, color: 'rgba(122,139,168,0.0)' },
            ],
          },
        },
      },
    ],
  });

  const getDemandForecastOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      bottom: 0,
      textStyle: { color: '#b0bec5', fontSize: 10 },
    },
    xAxis: {
      type: 'category',
      data: chartData.demandForecast.map(item => item.product),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '预测需求',
        type: 'bar',
        data: chartData.demandForecast.map(item => item.forecast),
        itemStyle: { color: colors.cyan, borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '实际销量',
        type: 'bar',
        data: chartData.demandForecast.map(item => item.actual),
        itemStyle: { color: colors.orange, borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
      },
    ],
  });

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const filteredStrategies = filterCategory === 'all'
    ? mtsStrategies
    : mtsStrategies.filter(strategy => strategy.category === filterCategory);

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              MTS策略管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">库存策略 · 生产计划 · 需求预测</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(245,124,0.15)', border: '1px solid rgba(245,124,0.3)', color: colors.orange }}>
              <Download className="w-4 h-4" />
              导出报表
            </button>
          </div>
        </div>
      </div>

      {/* 搜索与筛选 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品名称、类别..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部类别</option>
            <option value="电子产品">电子产品</option>
            <option value="可穿戴设备">可穿戴设备</option>
            <option value="音频设备">音频设备</option>
          </select>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="all">全部状态</option>
            <option value="optimal">最佳状态</option>
            <option value="warning">警告</option>
            <option value="critical">危险</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* MTS策略列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>策略管理</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              MTS策略配置
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共 {filteredStrategies.length} 个产品策略
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredStrategies.length && filteredStrategies.length > 0}
                    onChange={(e) =>
                      setSelectedProducts(
                        e.target.checked
                          ? filteredStrategies.map(s => s.id)
                          : [],
                      )
                    }
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">类别</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">当前库存</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">安全库存</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">补货点</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">最大库存</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">提前期</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">准时交货率</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">库存周转率</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredStrategies.map((strategy) => (
                <tr
                  key={strategy.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(strategy.id)}
                      onChange={() => toggleProductSelection(strategy.id)}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {strategy.product}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                      {strategy.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {strategy.currentStock}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {strategy.safetyStock}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {strategy.reorderPoint}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {strategy.maxStock}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {strategy.leadTime}天
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {strategy.fillRate}%
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {strategy.stockTurnover}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: strategy.status === 'optimal' ? 'rgba(0,137,123,0.15)' : strategy.status === 'warning' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (strategy.status === 'optimal' ? 'rgba(0,137,123,0.3)' : strategy.status === 'warning' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: strategy.status === 'optimal' ? '#00897b' : strategy.status === 'warning' ? colors.orange : '#e53935',
                      }}
                    >
                      {strategy.status === 'optimal' ? '最佳状态' : strategy.status === 'warning' ? '警告' : '危险'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      className="text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                      style={{
                        background: 'rgba(0,180,216,0.1)',
                        border: '1px solid rgba(0,180,216,0.2)',
                        color: colors.cyan,
                      }}
                    >
                      配置
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>库存趋势</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            产品库存水平趋势
          </h2>
          <ReactECharts option={getStockLevelTrendOption()} style={{ height: '300px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>需求预测</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            需求预测 vs 实际销量
          </h2>
          <ReactECharts option={getDemandForecastOption()} style={{ height: '300px', width: '100%' }} />
        </div>
      </div>

      {/* 生产计划 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产计划</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          生产执行情况
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">计划产量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">实际产量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产日期</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产效率</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
              </tr>
            </thead>
            <tbody>
              {productionPlans.map((plan) => (
                <tr
                  key={plan.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {plan.product}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {plan.planQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {plan.actualQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {plan.productionDate}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {plan.efficiency.toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: plan.status === 'completed' ? 'rgba(0,137,123,0.15)' : plan.status === 'in-progress' ? 'rgba(0,180,216,0.15)' : 'rgba(245,124,0.15)',
                        border: '1px solid ' + (plan.status === 'completed' ? 'rgba(0,137,123,0.3)' : plan.status === 'in-progress' ? 'rgba(0,180,216,0.3)' : 'rgba(245,124,0.3)'),
                        color: plan.status === 'completed' ? '#00897b' : plan.status === 'in-progress' ? colors.cyan : colors.orange,
                      }}
                    >
                      {plan.status === 'completed' ? '已完成' : plan.status === 'in-progress' ? '生产中' : '待开始'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
