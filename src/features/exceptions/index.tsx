// 智能异常页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Download, MoreVertical, ChevronRight } from 'lucide-react';

// 类型定义
interface Exception {
  id: number;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  module: string;
  location: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'resolved';
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

interface ExceptionStats {
  category: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
}

interface Ticket {
  id: number;
  exceptionId: number;
  title: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  resolveTime?: string;
}

// 模拟数据
const exceptions: Exception[] = [
  { id: 1, title: '原材料断供风险', category: '供应风险', severity: 'critical', module: '采购管理', location: '青岛总部', description: 'Bühler供应商原材料供应中断，影响生产线', timestamp: '2026-02-27 14:30:00', status: 'pending', assignee: '张三', priority: 'high' },
  { id: 2, title: '库存周转率下降', category: '库存风险', severity: 'warning', module: '库存管理', location: '苏州华东', description: '产品X1库存周转率下降15%，需关注', timestamp: '2026-02-27 13:15:00', status: 'processing', assignee: '李四', priority: 'medium' },
  { id: 3, title: '生产效率异常', category: '生产风险', severity: 'warning', module: '生产管理', location: '泰国曼谷', description: '生产线A效率下降12%，可能存在设备故障', timestamp: '2026-02-27 11:45:00', status: 'pending', assignee: '王五', priority: 'medium' },
  { id: 4, title: '物流延误预警', category: '物流风险', severity: 'info', module: '物流管理', location: '青岛总部', description: '预计配送时间延误2天', timestamp: '2026-02-27 10:20:00', status: 'resolved', assignee: '赵六', priority: 'low' },
  { id: 5, title: '质量检测不合格', category: '质量风险', severity: 'critical', module: '质量管理', location: '苏州华东', description: '批次20260201产品合格率仅85%', timestamp: '2026-02-27 09:30:00', status: 'processing', assignee: '钱七', priority: 'high' },
];

const exceptionStats: ExceptionStats[] = [
  { category: '供应风险', count: 12, severity: 'critical' },
  { category: '库存风险', count: 8, severity: 'warning' },
  { category: '生产风险', count: 15, severity: 'warning' },
  { category: '物流风险', count: 6, severity: 'info' },
  { category: '质量风险', count: 4, severity: 'critical' },
  { category: '需求风险', count: 10, severity: 'warning' },
];

const tickets: Ticket[] = [
  { id: 101, exceptionId: 1, title: 'Bühler供应商替代方案', type: '采购', priority: 'high', status: 'in-progress', assignee: '张三', createdAt: '2026-02-27 14:35:00', updatedAt: '2026-02-27 15:20:00' },
  { id: 102, exceptionId: 2, title: '产品X1库存优化', type: '库存', priority: 'medium', status: 'open', assignee: '李四', createdAt: '2026-02-27 13:20:00', updatedAt: '2026-02-27 13:20:00' },
  { id: 103, exceptionId: 5, title: '批次20260201质量整改', type: '质量', priority: 'high', status: 'processing', assignee: '钱七', createdAt: '2026-02-27 09:40:00', updatedAt: '2026-02-27 14:10:00' },
  { id: 104, exceptionId: 3, title: '生产线A设备维护', type: '生产', priority: 'medium', status: 'open', assignee: '王五', createdAt: '2026-02-27 11:50:00', updatedAt: '2026-02-27 11:50:00' },
];

const chartData = {
  exceptionTrend: [
    { date: '2026-02-20', critical: 3, warning: 8, info: 5 },
    { date: '2026-02-21', critical: 5, warning: 10, info: 7 },
    { date: '2026-02-22', critical: 2, warning: 6, info: 4 },
    { date: '2026-02-23', critical: 4, warning: 9, info: 6 },
    { date: '2026-02-24', critical: 6, warning: 12, info: 8 },
    { date: '2026-02-25', critical: 3, warning: 7, info: 5 },
    { date: '2026-02-26', critical: 2, warning: 5, info: 3 },
    { date: '2026-02-27', critical: 2, warning: 3, info: 1 },
  ],
  moduleDistribution: [
    { module: '采购管理', count: 12, color: '#e53935' },
    { module: '库存管理', count: 8, color: '#f57c00' },
    { module: '生产管理', count: 15, color: '#00897b' },
    { module: '物流管理', count: 6, color: '#2d7dd2' },
    { module: '质量管理', count: 4, color: '#e53935' },
    { module: '需求管理', count: 10, color: '#f57c00' },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function ExceptionsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedExceptions, setSelectedExceptions] = useState<number[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getExceptionTrendOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: '#b0bec5', fontSize: 10 },
    },
    xAxis: {
      type: 'category',
      data: chartData.exceptionTrend.map(item => item.date),
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
        name: '严重异常',
        type: 'line',
        data: chartData.exceptionTrend.map(item => item.critical),
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
        name: '警告异常',
        type: 'line',
        data: chartData.exceptionTrend.map(item => item.warning),
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
        name: '信息异常',
        type: 'line',
        data: chartData.exceptionTrend.map(item => item.info),
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
    ],
  });

  const getModuleDistributionOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 20, containLabel: true },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}个',
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#b0bec5', fontSize: 10 },
    },
    series: [
      {
        name: '模块分布',
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
          formatter: '{b}: {c}',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        data: chartData.moduleDistribution.map(item => ({
          value: item.count,
          name: item.module,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });

  const toggleExceptionSelection = (exceptionId: number) => {
    setSelectedExceptions(prev =>
      prev.includes(exceptionId)
        ? prev.filter(id => id !== exceptionId)
        : [...prev, exceptionId],
    );
  };

  const filteredExceptions = exceptions.filter(exception => {
    const severityMatch = filterSeverity === 'all' || exception.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || exception.status === filterStatus;
    return severityMatch && statusMatch;
  });

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2 animate-pulse" />
              智能异常管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">异常检测 · 分类统计 · 工单处理</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
              <Download className="w-4 h-4" />
              导出报表
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(245,124,0.15)', border: '1px solid rgba(245,124,0.3)', color: colors.orange }}>
              <AlertTriangle className="w-4 h-4" />
              新增异常
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
              placeholder="搜索异常标题、模块、位置..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* 异常统计 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>异常趋势</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            异常发生趋势
          </h2>
          <ReactECharts option={getExceptionTrendOption()} style={{ height: '280px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>模块分布</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            异常模块分布
          </h2>
          <ReactECharts option={getModuleDistributionOption()} style={{ height: '280px', width: '100%' }} />
        </div>
      </div>

      {/* 异常列表与工单 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 异常列表 */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>异常列表</div>
              <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
                异常详情
              </h2>
            </div>
            <div className="text-xs text-gray-400">
              共找到 <span className="text-cyan-400 font-bold">{filteredExceptions.length}</span> 个异常
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedExceptions.length === filteredExceptions.length && filteredExceptions.length > 0}
                      onChange={(e) =>
                        setSelectedExceptions(
                          e.target.checked
                            ? filteredExceptions.map(s => s.id)
                            : [],
                        )
                      }
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">异常标题</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">分类</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">严重度</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">模块</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">负责人</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">时间</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredExceptions.map((exception) => (
                  <tr
                    key={exception.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedExceptions.includes(exception.id)}
                        onChange={() => toggleExceptionSelection(exception.id)}
                        className="rounded border-gray-400 text-cyan-400"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                        {exception.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{exception.description}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                        {exception.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: exception.severity === 'critical' ? 'rgba(229,57,53,0.15)' : exception.severity === 'warning' ? 'rgba(245,124,0.15)' : 'rgba(0,137,123,0.15)',
                          border: '1px solid ' + (exception.severity === 'critical' ? 'rgba(229,57,53,0.3)' : exception.severity === 'warning' ? 'rgba(245,124,0.3)' : 'rgba(0,137,123,0.3)'),
                          color: exception.severity === 'critical' ? '#e53935' : exception.severity === 'warning' ? colors.orange : '#00897b',
                        }}
                      >
                        {exception.severity === 'critical' ? '严重' : exception.severity === 'warning' ? '警告' : '信息'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm" style={{ color: '#e8edf4' }}>
                        {exception.module}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: exception.status === 'pending' ? '#e53935' : exception.status === 'processing' ? colors.orange : '#00897b',
                          }}
                        />
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: exception.status === 'pending' ? 'rgba(229,57,53,0.15)' : exception.status === 'processing' ? 'rgba(245,124,0.15)' : 'rgba(0,137,123,0.15)',
                            border: '1px solid ' + (exception.status === 'pending' ? 'rgba(229,57,53,0.3)' : exception.status === 'processing' ? 'rgba(245,124,0.3)' : 'rgba(0,137,123,0.3)'),
                            color: exception.status === 'pending' ? '#e53935' : exception.status === 'processing' ? colors.orange : '#00897b',
                          }}
                        >
                          {exception.status === 'pending' ? '待处理' : exception.status === 'processing' ? '处理中' : '已解决'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm" style={{ color: '#e8edf4' }}>
                        {exception.assignee}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-xs text-gray-400">
                        {exception.timestamp}
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
                        处理 <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 处理工单 */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>处理工单</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            工单列表
          </h2>

          <div className="space-y-3 mb-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg p-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                    {ticket.title}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: ticket.status === 'open' ? 'rgba(229,57,53,0.15)' : ticket.status === 'in-progress' ? 'rgba(255,200,0.15)' : 'rgba(0,137,123,0.15)',
                      border: '1px solid ' + (ticket.status === 'open' ? 'rgba(229,57,53,0.3)' : ticket.status === 'in-progress' ? 'rgba(255,200,0.3)' : 'rgba(0,137,123,0.3)'),
                      color: ticket.status === 'open' ? '#e53935' : ticket.status === 'in-progress' ? colors.orange : '#00897b',
                    }}
                  >
                    {ticket.status === 'open' ? '待处理' : ticket.status === 'in-progress' ? '处理中' : '已完成'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-2">{ticket.type}工单</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    负责人: {ticket.assignee}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: ticket.priority === 'high' ? 'rgba(229,57,53,0.15)' : ticket.priority === 'medium' ? 'rgba(245,124,0.15)' : 'rgba(0,137,123,0.15)',
                        border: '1px solid ' + (ticket.priority === 'high' ? 'rgba(229,57,53,0.3)' : ticket.priority === 'medium' ? 'rgba(245,124,0.3)' : 'rgba(0,137,123,0.3)'),
                        color: ticket.priority === 'high' ? '#e53935' : ticket.priority === 'medium' ? colors.orange : '#00897b',
                      }}
                    >
                      {ticket.priority === 'high' ? '高' : ticket.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span className="text-xs text-gray-400">{ticket.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            style={{
              background: 'rgba(0,180,216,0.1)',
              border: '1px solid rgba(0,180,216,0.2)',
              color: colors.cyan,
            }}
          >
            查看全部工单 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 异常分类统计 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>分类统计</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          异常分类分布
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {exceptionStats.map((stat, index) => (
            <div
              key={index}
              className="rounded-lg p-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: stat.severity === 'critical' ? '#e53935' : stat.severity === 'warning' ? colors.orange : '#00897b',
                  }}
                />
                <span className="text-sm font-bold" style={{ color: stat.severity === 'critical' ? '#e53935' : stat.severity === 'warning' ? colors.orange : '#00897b' }}>
                  {stat.count}
                </span>
              </div>
              <div className="text-sm font-medium" style={{ color: '#e8edf4' }}>
                {stat.category}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {stat.severity === 'critical' ? '严重' : stat.severity === 'warning' ? '警告' : '信息'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
