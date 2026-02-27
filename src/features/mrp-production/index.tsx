// 工单建议页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { CheckCircle2, AlertTriangle, TrendingUp, Clock, Filter, Search, Download, Plus, RefreshCw, MoreVertical, ChevronRight, XCircle } from 'lucide-react';

// 类型定义
interface ProductionOrder {
  id: number;
  orderNumber: string;
  product: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_production' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  productionLine: string;
  efficiency: number;
  defectRate: number;
}

interface ProductionLine {
  id: number;
  name: string;
  capacity: number;
  utilization: number;
  status: 'running' | 'maintenance' | 'idle';
  currentOrders: number;
}

// 模拟数据
const productionOrders: ProductionOrder[] = [
  { id: 1, orderNumber: 'PO20260201', product: '高性能服务器', quantity: 20, priority: 'high', status: 'in_production', scheduledStart: '2026-02-27 08:00', scheduledEnd: '2026-02-28 17:00', actualStart: '2026-02-27 08:00', productionLine: 'A线', efficiency: 92, defectRate: 1.2 },
  { id: 2, orderNumber: 'PO20260202', product: '工业级PC', quantity: 35, priority: 'medium', status: 'pending', scheduledStart: '2026-02-28 08:00', scheduledEnd: '2026-03-01 12:00', productionLine: 'B线', efficiency: 88, defectRate: 0.8 },
  { id: 3, orderNumber: 'PO20260203', product: '嵌入式控制器', quantity: 50, priority: 'low', status: 'pending', scheduledStart: '2026-03-01 08:00', scheduledEnd: '2026-03-02 16:00', productionLine: 'C线', efficiency: 85, defectRate: 1.5 },
  { id: 4, orderNumber: 'PO20260204', product: '数据存储设备', quantity: 15, priority: 'high', status: 'pending', scheduledStart: '2026-03-02 08:00', scheduledEnd: '2026-03-03 18:00', productionLine: 'A线', efficiency: 95, defectRate: 0.5 },
  { id: 5, orderNumber: 'PO20260205', product: '网络交换机', quantity: 40, priority: 'medium', status: 'completed', scheduledStart: '2026-02-25 08:00', scheduledEnd: '2026-02-26 17:00', actualStart: '2026-02-25 08:00', actualEnd: '2026-02-26 16:30', productionLine: 'B线', efficiency: 90, defectRate: 0.9 },
  { id: 6, orderNumber: 'PO20260206', product: '无线接入点', quantity: 60, priority: 'low', status: 'pending', scheduledStart: '2026-03-03 08:00', scheduledEnd: '2026-03-04 17:00', productionLine: 'C线', efficiency: 87, defectRate: 1.1 },
];

const productionLines: ProductionLine[] = [
  { id: 1, name: 'A线 - 高性能服务器', capacity: 25, utilization: 95, status: 'running', currentOrders: 2 },
  { id: 2, name: 'B线 - 工业级PC', capacity: 40, utilization: 85, status: 'running', currentOrders: 3 },
  { id: 3, name: 'C线 - 嵌入式控制器', capacity: 60, utilization: 75, status: 'idle', currentOrders: 1 },
  { id: 4, name: 'D线 - 数据存储设备', capacity: 20, utilization: 90, status: 'maintenance', currentOrders: 0 },
];

const chartData = {
  productionStatus: [
    { name: '待生产', value: 4, color: '#00b4d8' },
    { name: '生产中', value: 1, color: '#ffc107' },
    { name: '已完成', value: 1, color: '#4caf50' },
    { name: '已取消', value: 0, color: '#f44336' },
  ],
  efficiencyTrend: [
    { month: '1月', efficiency: 88 },
    { month: '2月', efficiency: 90 },
    { month: '3月', efficiency: 92 },
    { month: '4月', efficiency: 91 },
    { month: '5月', efficiency: 93 },
    { month: '6月', efficiency: 92 },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function MRPProductionPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductionStatusOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.productionStatus.map(item => item.name),
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
        data: chartData.productionStatus.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: (params: any) => chartData.productionStatus[params.dataIndex].color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const getEfficiencyTrendOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.efficiencyTrend.map(item => item.month),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 80,
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        data: chartData.efficiencyTrend.map(item => item.efficiency),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00b4d8', width: 2 },
        areaStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,180,216,0.3)' },
            { offset: 1, color: 'rgba(0,180,216,0.05)' },
          ]),
        },
        itemStyle: {
          color: '#00b4d8',
          borderRadius: 4,
        },
        symbolSize: 4,
      },
    ],
  });

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
  };

  const filteredOrders = filterPriority === 'all'
    ? productionOrders
    : productionOrders.filter(order => order.priority === filterPriority);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    if (sortBy === 'efficiency') {
      return b.efficiency - a.efficiency;
    }
    return a.id - b.id;
  });

  const handleGenerateOrder = () => {
    alert('已生成新的生产工单');
  };

  const handleBatchStart = () => {
    alert('已开始批量生产');
    setSelectedOrders([]);
  };

  const handleBatchComplete = () => {
    alert('已完成批量生产');
    setSelectedOrders([]);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              工单建议管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">工单列表 · 优先级排序 · 生成工单</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{
                background: 'rgba(0,180,216,0.15)',
                border: '1px solid rgba(0,180,216,0.3)',
                color: colors.cyan,
              }}
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{
                background: 'rgba(245,124,0,0.15)',
                border: '1px solid rgba(245,124,0.3)',
                color: colors.orange,
              }}
              onClick={handleGenerateOrder}
            >
              <Plus className="w-4 h-4" />
              生成工单
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{
                background: 'rgba(76,175,80,0.15)',
                border: '1px solid rgba(76,175,80,0.3)',
                color: '#4caf50',
              }}
            >
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
              placeholder="搜索订单编号、产品名称..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部优先级</option>
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="priority">按优先级</option>
            <option value="quantity">按数量</option>
            <option value="efficiency">按效率</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* 工单列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>工单列表</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              生产工单建议
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共找到 <span className="text-cyan-400 font-bold">{filteredOrders.length}</span> 个工单
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) =>
                      setSelectedOrders(
                        e.target.checked
                          ? filteredOrders.map(order => order.id)
                          : [],
                      )
                    }
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">订单编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">优先级</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">计划时间</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产线</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">效率</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: colors.cyan }}>
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {order.product}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {order.quantity} 台
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: order.priority === 'high' ? 'rgba(244,67,54,0.15)' : order.priority === 'medium' ? 'rgba(255,193,7,0.15)' : 'rgba(76,175,80,0.15)',
                        border: '1px solid ' + (order.priority === 'high' ? 'rgba(244,67,54,0.3)' : order.priority === 'medium' ? 'rgba(255,193,7,0.3)' : 'rgba(76,175,80,0.3)'),
                        color: order.priority === 'high' ? '#f44336' : order.priority === 'medium' ? '#ffc107' : '#4caf50',
                      }}
                    >
                      {order.priority === 'high' ? '高' : order.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                      style={{
                        background: order.status === 'completed' ? 'rgba(76,175,80,0.15)' : order.status === 'in_production' ? 'rgba(255,193,7,0.15)' : order.status === 'cancelled' ? 'rgba(244,67,54,0.15)' : 'rgba(0,180,216,0.15)',
                        border: '1px solid ' + (order.status === 'completed' ? 'rgba(76,175,80,0.3)' : order.status === 'in_production' ? 'rgba(255,193,7,0.3)' : order.status === 'cancelled' ? 'rgba(244,67,54,0.3)' : 'rgba(0,180,216,0.3)'),
                        color: order.status === 'completed' ? '#4caf50' : order.status === 'in_production' ? '#ffc107' : order.status === 'cancelled' ? '#f44336' : colors.cyan,
                      }}
                    >
                      {order.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : order.status === 'in_production' ? (
                        <Clock className="w-3 h-3" />
                      ) : order.status === 'cancelled' ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {order.status === 'completed' ? '已完成' : order.status === 'in_production' ? '生产中' : order.status === 'cancelled' ? '已取消' : '待生产'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-xs text-gray-400">
                      {order.scheduledStart}<br />
                      {order.scheduledEnd}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {order.productionLine}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                        {order.efficiency}%
                      </div>
                      <div className="w-12 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${order.efficiency}%`,
                            background: order.efficiency >= 90 ? 'linear-gradient(90deg, #4caf50, #81c784)' : order.efficiency >= 80 ? 'linear-gradient(90deg, #ffc107, #ff9800)' : 'linear-gradient(90deg, #f44336, #e57373)',
                          }}
                        />
                      </div>
                    </div>
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
                      详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 生产统计与生产线状态 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 批量操作 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>批量操作</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            批量处理
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                已选择 <span className="text-cyan-400 font-bold">{selectedOrders.length}</span> 个工单
              </div>
              <button
                onClick={() => setSelectedOrders([])}
                className="text-xs text-red-400 hover:text-red-300"
              >
                清除
              </button>
            </div>

            <button
              onClick={handleBatchStart}
              disabled={selectedOrders.length === 0}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: selectedOrders.length > 0 ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedOrders.length > 0 ? '1px solid rgba(255,193,7,0.3)' : '1px solid rgba(255,255,255,0.05)',
                color: selectedOrders.length > 0 ? '#ffc107' : 'rgba(255,255,255,0.3)',
              }}
            >
              <Clock className="w-4 h-4" />
              批量开始生产
            </button>

            <button
              onClick={handleBatchComplete}
              disabled={selectedOrders.length === 0}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: selectedOrders.length > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedOrders.length > 0 ? '1px solid rgba(76,175,80,0.3)' : '1px solid rgba(255,255,255,0.05)',
                color: selectedOrders.length > 0 ? '#4caf50' : 'rgba(255,255,255,0.3)',
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              批量完成
            </button>

            <button
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: 'rgba(0,180,216,0.1)',
                border: '1px solid rgba(0,180,216,0.2)',
                color: colors.cyan,
              }}
            >
              <MoreVertical className="w-4 h-4" />
              更多操作
            </button>
          </div>
        </div>

        {/* 生产状态统计 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产状态</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            工单状态分布
          </h2>
          <ReactECharts option={getProductionStatusOption()} style={{ height: '200px', width: '100%' }} />
        </div>

        {/* 效率趋势 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产效率</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            效率趋势
          </h2>
          <ReactECharts option={getEfficiencyTrendOption()} style={{ height: '200px', width: '100%' }} />
        </div>
      </div>

      {/* 生产线状态 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产线状态</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          生产线运行状况
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {productionLines.map((line) => (
            <div
              key={line.id}
              className="rounded-lg p-4"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                  {line.name}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: line.status === 'running' ? 'rgba(76,175,80,0.15)' : line.status === 'maintenance' ? 'rgba(255,193,7,0.15)' : 'rgba(0,180,216,0.15)',
                    border: '1px solid ' + (line.status === 'running' ? 'rgba(76,175,80,0.3)' : line.status === 'maintenance' ? 'rgba(255,193,7,0.3)' : 'rgba(0,180,216,0.3)'),
                    color: line.status === 'running' ? '#4caf50' : line.status === 'maintenance' ? '#ffc107' : colors.cyan,
                  }}
                >
                  {line.status === 'running' ? '运行中' : line.status === 'maintenance' ? '维护中' : '空闲'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#b0bec5' }}>产能:</span>
                  <span style={{ color: '#e8edf4' }}>{line.capacity} 台/天</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span style={{ color: '#b0bec5' }}>利用率:</span>
                  <span style={{ color: '#e8edf4' }}>{line.utilization}%</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span style={{ color: '#b0bec5' }}>当前订单:</span>
                  <span style={{ color: '#e8edf4' }}>{line.currentOrders} 个</span>
                </div>

                <div className="mt-3">
                  <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${line.utilization}%`,
                        background: line.utilization >= 90 ? 'linear-gradient(90deg, #f44336, #e57373)' : line.utilization >= 80 ? 'linear-gradient(90deg, #ffc107, #ff9800)' : 'linear-gradient(90deg, #4caf50, #81c784)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
