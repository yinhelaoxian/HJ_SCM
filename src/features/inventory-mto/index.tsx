// MTO策略页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { FileText, Factory, Package, TrendingUp, Clock, CheckCircle, AlertTriangle, Search, Filter, Download, RefreshCw } from 'lucide-react';

// 类型定义
interface MTOOrder {
  id: number;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  remainingDays: number;
  productionStatus: 'planning' | 'in-progress' | 'completed' | 'delayed';
  qualityStatus: 'pass' | 'fail' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
}

interface ProductionProcess {
  id: number;
  orderNumber: string;
  processName: string;
  expectedDays: number;
  actualDays: number | null;
  efficiency: number;
  status: 'completed' | 'in-progress' | 'pending';
}

// 颜色常量
const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

// 模拟数据
const mtoOrders: MTOOrder[] = [
  { id: 1, orderNumber: 'MTO-2026-001', customer: '苹果公司', product: 'iPhone 15 Pro 外壳', quantity: 5000, unitPrice: 125.5, totalAmount: 627500, orderDate: '2026-01-15', deliveryDate: '2026-03-15', remainingDays: 47, productionStatus: 'in-progress', qualityStatus: 'pending', riskLevel: 'medium' },
  { id: 2, orderNumber: 'MTO-2026-002', customer: '三星电子', product: 'Galaxy S24 电池', quantity: 8000, unitPrice: 89.0, totalAmount: 712000, orderDate: '2026-02-01', deliveryDate: '2026-04-01', remainingDays: 63, productionStatus: 'planning', qualityStatus: 'pending', riskLevel: 'low' },
  { id: 3, orderNumber: 'MTO-2026-003', customer: '华为技术', product: 'Mate X5 屏幕', quantity: 3000, unitPrice: 350.0, totalAmount: 1050000, orderDate: '2026-01-20', deliveryDate: '2026-03-10', remainingDays: 42, productionStatus: 'in-progress', qualityStatus: 'pass', riskLevel: 'high' },
  { id: 4, orderNumber: 'MTO-2026-004', customer: '小米科技', product: 'Mi 14 摄像头模块', quantity: 6000, unitPrice: 110.0, totalAmount: 660000, orderDate: '2026-02-05', deliveryDate: '2026-03-25', remainingDays: 56, productionStatus: 'in-progress', qualityStatus: 'pending', riskLevel: 'medium' },
  { id: 5, orderNumber: 'MTO-2026-005', customer: 'OPPO', product: 'Find X7 外壳', quantity: 4000, unitPrice: 145.0, totalAmount: 580000, orderDate: '2026-01-25', deliveryDate: '2026-03-20', remainingDays: 51, productionStatus: 'delayed', qualityStatus: 'fail', riskLevel: 'high' },
];

const productionProcesses: ProductionProcess[] = [
  { id: 1, orderNumber: 'MTO-2026-001', processName: '材料采购', expectedDays: 3, actualDays: 3, efficiency: 100, status: 'completed' },
  { id: 2, orderNumber: 'MTO-2026-001', processName: 'CNC加工', expectedDays: 10, actualDays: 8, efficiency: 125, status: 'completed' },
  { id: 3, orderNumber: 'MTO-2026-001', processName: '表面处理', expectedDays: 5, actualDays: 4, efficiency: 125, status: 'completed' },
  { id: 4, orderNumber: 'MTO-2026-001', processName: '品质检测', expectedDays: 2, actualDays: null, efficiency: 0, status: 'in-progress' },
];

const chartData = {
  orderStatus: [
    { name: '计划中', value: 25, color: colors.orange },
    { name: '生产中', value: 45, color: colors.cyan },
    { name: '已完成', value: 20, color: '#00897b' },
    { name: '已延迟', value: 10, color: '#e53935' },
  ],
  orderDistribution: [
    { name: '苹果公司', value: 35 },
    { name: '三星电子', value: 28 },
    { name: '华为技术', value: 22 },
    { name: '小米科技', value: 10 },
    { name: 'OPPO', value: 5 },
  ],
  riskLevel: [
    { name: '低风险', value: 20 },
    { name: '中风险', value: 50 },
    { name: '高风险', value: 30 },
  ],
};

export default function InventoryMTOPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getOrderStatusOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { color: '#b0bec5', fontSize: 10 } },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: colors.navy,
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#b0bec5',
          fontSize: 10,
          formatter: '{b}: {c}%',
        },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: chartData.orderStatus.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });

  const getOrderDistributionOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { color: '#b0bec5', fontSize: 10 } },
    series: [
      {
        name: '客户分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: colors.navy,
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#b0bec5',
          fontSize: 10,
          formatter: '{b}: {c}%',
        },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: chartData.orderDistribution.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: index === 0 ? colors.cyan : index === 1 ? colors.orange : index === 2 ? '#00897b' : index === 3 ? '#7a8ba8' : '#e53935',
          },
        })),
      },
    ],
  });

  const getRiskLevelOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { color: '#b0bec5', fontSize: 10 } },
    series: [
      {
        name: '风险等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: colors.navy,
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#b0bec5',
          fontSize: 10,
          formatter: '{b}: {c}%',
        },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: chartData.riskLevel.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.name === '低风险' ? '#00897b' : item.name === '中风险' ? colors.orange : '#e53935',
          },
        })),
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

  const filteredOrders = filterStatus === 'all'
    ? mtoOrders
    : mtoOrders.filter(order => order.productionStatus === filterStatus);

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              MTO策略管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">订单管理 · 生产跟踪 · 风险监控</p>
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
              placeholder="搜索订单编号、客户名称、产品..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部状态</option>
            <option value="planning">计划中</option>
            <option value="in-progress">生产中</option>
            <option value="completed">已完成</option>
            <option value="delayed">已延迟</option>
          </select>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="all">风险等级</option>
            <option value="low">低风险</option>
            <option value="medium">中风险</option>
            <option value="high">高风险</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>订单管理</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              MTO订单列表
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共 {filteredOrders.length} 个订单
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
                          ? filteredOrders.map(o => o.id)
                          : [],
                      )
                    }
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">订单编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">客户</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">总金额</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">交货日期</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">剩余天数</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">质量状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">风险等级</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
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
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {order.customer}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                      {order.product}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {order.quantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      ¥{(order.totalAmount / 10000).toFixed(1)}万
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {order.deliveryDate}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: order.remainingDays <= 7 ? '#e53935' : order.remainingDays <= 14 ? colors.orange : '#00897b' }}>
                      {order.remainingDays}天
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: order.productionStatus === 'planning' ? 'rgba(245,124,0.15)' : order.productionStatus === 'in-progress' ? 'rgba(0,180,216,0.15)' : order.productionStatus === 'completed' ? 'rgba(0,137,123,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (order.productionStatus === 'planning' ? 'rgba(245,124,0.3)' : order.productionStatus === 'in-progress' ? 'rgba(0,180,216,0.3)' : order.productionStatus === 'completed' ? 'rgba(0,137,123,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: order.productionStatus === 'planning' ? colors.orange : order.productionStatus === 'in-progress' ? colors.cyan : order.productionStatus === 'completed' ? '#00897b' : '#e53935',
                      }}
                    >
                      {order.productionStatus === 'planning' ? '计划中' : order.productionStatus === 'in-progress' ? '生产中' : order.productionStatus === 'completed' ? '已完成' : '已延迟'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: order.qualityStatus === 'pass' ? 'rgba(0,137,123,0.15)' : order.qualityStatus === 'fail' ? 'rgba(229,57,53,0.15)' : 'rgba(245,124,0.15)',
                        border: '1px solid ' + (order.qualityStatus === 'pass' ? 'rgba(0,137,123,0.3)' : order.qualityStatus === 'fail' ? 'rgba(229,57,53,0.3)' : 'rgba(245,124,0.3)'),
                        color: order.qualityStatus === 'pass' ? '#00897b' : order.qualityStatus === 'fail' ? '#e53935' : colors.orange,
                      }}
                    >
                      {order.qualityStatus === 'pass' ? '合格' : order.qualityStatus === 'fail' ? '不合格' : '待检测'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: order.riskLevel === 'low' ? 'rgba(0,137,123,0.15)' : order.riskLevel === 'medium' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (order.riskLevel === 'low' ? 'rgba(0,137,123,0.3)' : order.riskLevel === 'medium' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: order.riskLevel === 'low' ? '#00897b' : order.riskLevel === 'medium' ? colors.orange : '#e53935',
                      }}
                    >
                      {order.riskLevel === 'low' ? '低风险' : order.riskLevel === 'medium' ? '中风险' : '高风险'}
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
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>订单状态</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            生产状态分布
          </h2>
          <ReactECharts option={getOrderStatusOption()} style={{ height: '200px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>客户分布</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            订单客户分布
          </h2>
          <ReactECharts option={getOrderDistributionOption()} style={{ height: '200px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>风险监控</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            风险等级分布
          </h2>
          <ReactECharts option={getRiskLevelOption()} style={{ height: '200px', width: '100%' }} />
        </div>
      </div>

      {/* 生产过程跟踪 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产过程</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          生产过程跟踪
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">订单编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">工序名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">计划天数</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">实际天数</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产效率</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
              </tr>
            </thead>
            <tbody>
              {productionProcesses.map((process) => (
                <tr
                  key={process.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {process.orderNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {process.processName}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {process.expectedDays}天
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {process.actualDays || '进行中'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: process.efficiency > 100 ? '#00897b' : process.efficiency < 100 ? '#e53935' : colors.cyan }}>
                      {process.efficiency}%
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: process.status === 'completed' ? 'rgba(0,137,123,0.15)' : process.status === 'in-progress' ? 'rgba(0,180,216,0.15)' : 'rgba(245,124,0.15)',
                        border: '1px solid ' + (process.status === 'completed' ? 'rgba(0,137,123,0.3)' : process.status === 'in-progress' ? 'rgba(0,180,216,0.3)' : 'rgba(245,124,0.3)'),
                        color: process.status === 'completed' ? '#00897b' : process.status === 'in-progress' ? colors.cyan : colors.orange,
                      }}
                    >
                      {process.status === 'completed' ? '已完成' : process.status === 'in-progress' ? '进行中' : '待开始'}
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
