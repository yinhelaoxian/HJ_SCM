// 投料管理页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Package, Factory, BarChart3, TrendingUp, AlertTriangle, Search, Filter, Download, RefreshCw } from 'lucide-react';

// 类型定义
interface ProductionIssue {
  id: number;
  workOrderNumber: string;
  product: string;
  category: string;
  plannedQuantity: number;
  issuedQuantity: number;
  remainingQuantity: number;
  materialStatus: 'available' | 'partial' | 'missing';
  productionLine: string;
  supervisor: string;
  issueDate: string;
  expectedCompletionDate: string;
  status: 'planning' | 'in-progress' | 'completed';
  efficiency: number;
  qualityRate: number;
}

interface MaterialRequirement {
  id: number;
  workOrderNumber: string;
  materialCode: string;
  materialName: string;
  unit: string;
  requiredQuantity: number;
  availableQuantity: number;
  status: 'available' | 'pending' | 'shortage' | 'partial';
  location: string;
  batchNumber: string;
}

// 模拟数据
const productionIssues: ProductionIssue[] = [
  { id: 1, workOrderNumber: 'WO-2026-001', product: '智能手机 X1', category: '电子产品', plannedQuantity: 500, issuedQuantity: 350, remainingQuantity: 150, materialStatus: 'partial', productionLine: 'Line 1', supervisor: '张经理', issueDate: '2026-02-25', expectedCompletionDate: '2026-03-05', status: 'in-progress', efficiency: 85.5, qualityRate: 98.2 },
  { id: 2, workOrderNumber: 'WO-2026-002', product: '笔记本电脑 Pro', category: '电子产品', plannedQuantity: 300, issuedQuantity: 300, remainingQuantity: 0, materialStatus: 'available', productionLine: 'Line 2', supervisor: '李主管', issueDate: '2026-02-24', expectedCompletionDate: '2026-03-10', status: 'in-progress', efficiency: 92.3, qualityRate: 99.1 },
  { id: 3, workOrderNumber: 'WO-2026-003', product: '智能手表 S3', category: '可穿戴设备', plannedQuantity: 400, issuedQuantity: 0, remainingQuantity: 400, materialStatus: 'missing', productionLine: 'Line 3', supervisor: '王工程师', issueDate: '2026-02-28', expectedCompletionDate: '2026-03-15', status: 'planning', efficiency: 0, qualityRate: 0 },
  { id: 4, workOrderNumber: 'WO-2026-004', product: '平板电脑 Tab', category: '电子产品', plannedQuantity: 250, issuedQuantity: 200, remainingQuantity: 50, materialStatus: 'partial', productionLine: 'Line 4', supervisor: '赵组长', issueDate: '2026-02-23', expectedCompletionDate: '2026-03-08', status: 'in-progress', efficiency: 78.9, qualityRate: 96.8 },
  { id: 5, workOrderNumber: 'WO-2026-005', product: '无线耳机 Air', category: '音频设备', plannedQuantity: 600, issuedQuantity: 600, remainingQuantity: 0, materialStatus: 'available', productionLine: 'Line 5', supervisor: '刘工程师', issueDate: '2026-02-20', expectedCompletionDate: '2026-03-03', status: 'completed', efficiency: 95.7, qualityRate: 99.5 },
];

const materialRequirements: MaterialRequirement[] = [
  { id: 1, workOrderNumber: 'WO-2026-001', materialCode: 'MAT-001', materialName: 'CPU芯片', unit: '个', requiredQuantity: 500, availableQuantity: 350, status: 'partial', location: 'A-01-05', batchNumber: 'B20260115' },
  { id: 2, workOrderNumber: 'WO-2026-001', materialCode: 'MAT-002', materialName: '内存芯片', unit: '个', requiredQuantity: 500, availableQuantity: 500, status: 'available', location: 'B-02-03', batchNumber: 'B20260120' },
  { id: 3, workOrderNumber: 'WO-2026-001', materialCode: 'MAT-003', materialName: '电池', unit: '个', requiredQuantity: 500, availableQuantity: 280, status: 'partial', location: 'C-03-08', batchNumber: 'B20260201' },
  { id: 4, workOrderNumber: 'WO-2026-003', materialCode: 'MAT-004', materialName: '传感器', unit: '个', requiredQuantity: 400, availableQuantity: 0, status: 'shortage', location: 'D-04-02', batchNumber: 'B20260215' },
  { id: 5, workOrderNumber: 'WO-2026-005', materialCode: 'MAT-005', materialName: '扬声器', unit: '个', requiredQuantity: 600, availableQuantity: 600, status: 'available', location: 'E-05-06', batchNumber: 'B20260218' },
];

const chartData = {
  issueProgress: [
    { workOrder: 'WO-2026-001', planned: 500, issued: 350 },
    { workOrder: 'WO-2026-002', planned: 300, issued: 300 },
    { workOrder: 'WO-2026-003', planned: 400, issued: 0 },
    { workOrder: 'WO-2026-004', planned: 250, issued: 200 },
    { workOrder: 'WO-2026-005', planned: 600, issued: 600 },
  ],
  materialStatus: [
    { status: '齐套', value: 45, color: '#00897b' },
    { status: '部分齐套', value: 35, color: colors.orange },
    { status: '缺料', value: 20, color: '#e53935' },
  ],
  efficiencyTrend: [
    { date: '2026-02-20', efficiency: 88.5 },
    { date: '2026-02-21', efficiency: 91.2 },
    { date: '2026-02-22', efficiency: 89.8 },
    { date: '2026-02-23', efficiency: 92.3 },
    { date: '2026-02-24', efficiency: 90.7 },
    { date: '2026-02-25', efficiency: 87.5 },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function ProductionIssuePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<number[]>([]);
  const [filterLine, setFilterLine] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIssueProgressOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, textStyle: { color: '#b0bec5', fontSize: 10 } },
    xAxis: {
      type: 'category',
      data: chartData.issueProgress.map(item => item.workOrder),
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
        name: '计划数量',
        type: 'bar',
        data: chartData.issueProgress.map(item => item.planned),
        itemStyle: { color: 'rgba(255,255,255,0.1)', borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '已投料数量',
        type: 'bar',
        data: chartData.issueProgress.map(item => item.issued),
        itemStyle: { color: colors.cyan, borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
      },
    ],
  });

  const getMaterialStatusOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { color: '#b0bec5', fontSize: 10 } },
    series: [
      {
        name: '物料状态',
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
        data: chartData.materialStatus.map((item) => ({
          value: item.value,
          name: item.status,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });

  const getEfficiencyTrendOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData.efficiencyTrend.map(item => item.date),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#b0bec5', fontSize: 10, formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '生产效率',
        type: 'line',
        data: chartData.efficiencyTrend.map(item => item.efficiency),
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

  const toggleIssueSelection = (issueId: number) => {
    setSelectedIssues(prev =>
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId],
    );
  };

  const filteredIssues = filterLine === 'all'
    ? productionIssues
    : productionIssues.filter(issue => issue.productionLine === filterLine);

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              投料管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">工单投料 · 物料齐套 · 生产进度</p>
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
              placeholder="搜索工单编号、产品名称、生产线..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select
            value={filterLine}
            onChange={(e) => setFilterLine(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
          >
            <option value="all">全部生产线</option>
            <option value="Line 1">Line 1</option>
            <option value="Line 2">Line 2</option>
            <option value="Line 3">Line 3</option>
            <option value="Line 4">Line 4</option>
            <option value="Line 5">Line 5</option>
          </select>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="all">物料状态</option>
            <option value="available">齐套</option>
            <option value="partial">部分齐套</option>
            <option value="missing">缺料</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* 投料进度列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>工单投料</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              投料进度列表
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共 {filteredIssues.length} 个工单
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                    onChange={(e) =>
                      setSelectedIssues(
                        e.target.checked
                          ? filteredIssues.map(o => o.id)
                          : [],
                      )
                    }
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">工单编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">类别</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">计划数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">已投料数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">剩余数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">物料状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">生产线</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">负责人</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue.id)}
                      onChange={() => toggleIssueSelection(issue.id)}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {issue.workOrderNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {issue.product}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                      {issue.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {issue.plannedQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {issue.issuedQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: issue.remainingQuantity > 0 ? colors.orange : '#00897b' }}>
                      {issue.remainingQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: issue.materialStatus === 'available' ? 'rgba(0,137,123,0.15)' : issue.materialStatus === 'partial' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (issue.materialStatus === 'available' ? 'rgba(0,137,123,0.3)' : issue.materialStatus === 'partial' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: issue.materialStatus === 'available' ? '#00897b' : issue.materialStatus === 'partial' ? colors.orange : '#e53935',
                      }}
                    >
                      {issue.materialStatus === 'available' ? '齐套' : issue.materialStatus === 'partial' ? '部分齐套' : '缺料'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {issue.productionLine}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {issue.supervisor}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: issue.status === 'planning' ? 'rgba(245,124,0.15)' : issue.status === 'in-progress' ? 'rgba(0,180,216,0.15)' : 'rgba(0,137,123,0.15)',
                        border: '1px solid ' + (issue.status === 'planning' ? 'rgba(245,124,0.3)' : issue.status === 'in-progress' ? 'rgba(0,180,216,0.3)' : 'rgba(0,137,123,0.3)'),
                        color: issue.status === 'planning' ? colors.orange : issue.status === 'in-progress' ? colors.cyan : '#00897b',
                      }}
                    >
                      {issue.status === 'planning' ? '计划中' : issue.status === 'in-progress' ? '进行中' : '已完成'}
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
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>投料进度</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            工单投料完成率
          </h2>
          <ReactECharts option={getIssueProgressOption()} style={{ height: '200px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>物料状态</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            物料齐套情况
          </h2>
          <ReactECharts option={getMaterialStatusOption()} style={{ height: '200px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>生产效率</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            效率趋势分析
          </h2>
          <ReactECharts option={getEfficiencyTrendOption()} style={{ height: '200px', width: '100%' }} />
        </div>
      </div>

      {/* 物料需求 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>物料需求</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          物料需求与齐套状态
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">工单编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">物料编码</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">物料名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">单位</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">需求数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">可用数量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">库位</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">批次号</th>
              </tr>
            </thead>
            <tbody>
              {materialRequirements.map((material) => (
                <tr
                  key={material.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.workOrderNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.materialCode}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {material.materialName}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.unit}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.requiredQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: material.availableQuantity >= material.requiredQuantity ? '#00897b' : material.availableQuantity > 0 ? colors.orange : '#e53935' }}>
                      {material.availableQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: material.status === 'available' ? 'rgba(0,137,123,0.15)' : material.status === 'pending' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (material.status === 'available' ? 'rgba(0,137,123,0.3)' : material.status === 'pending' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: material.status === 'available' ? '#00897b' : material.status === 'pending' ? colors.orange : '#e53935',
                      }}
                    >
                      {material.status === 'available' ? '齐套' : material.status === 'pending' ? '待齐套' : '缺料'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.location}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {material.batchNumber}
                    </div>
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
