// 采购建议页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { CheckCircle2, XCircle, AlertTriangle, Filter, Download, Search, ChevronRight, MoreVertical, Plus, RefreshCw } from 'lucide-react';

// 类型定义
interface PurchaseSuggestion {
  id: number;
  product: string;
  category: string;
  currentStock: number;
  requiredQuantity: number;
  suggestedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalProcess {
  id: number;
  step: string;
  user: string;
  department: string;
  status: 'completed' | 'pending' | 'rejected';
  time: string;
}

// 模拟数据
const suggestions: PurchaseSuggestion[] = [
  { id: 1, product: 'CPU处理器 i7-13700K', category: '电子元器件', currentStock: 12, requiredQuantity: 50, suggestedQuantity: 40, unitPrice: 2599, totalPrice: 103960, supplier: 'Intel授权供应商', priority: 'high', status: 'pending' },
  { id: 2, product: 'DDR5 32GB内存条', category: '电子元器件', currentStock: 25, requiredQuantity: 80, suggestedQuantity: 55, unitPrice: 599, totalPrice: 32945, supplier: 'Samsung电子', priority: 'medium', status: 'pending' },
  { id: 3, product: 'NVIDIA RTX 4090显卡', category: '电子元器件', currentStock: 5, requiredQuantity: 20, suggestedQuantity: 15, unitPrice: 12999, totalPrice: 194985, supplier: 'NVIDIA授权代理', priority: 'high', status: 'approved' },
  { id: 4, product: 'SSD 2TB PCIe 4.0', category: '电子元器件', currentStock: 30, requiredQuantity: 60, suggestedQuantity: 35, unitPrice: 899, totalPrice: 31465, supplier: '西部数据', priority: 'low', status: 'pending' },
  { id: 5, product: '27寸 4K显示器', category: '电子产品', currentStock: 18, requiredQuantity: 40, suggestedQuantity: 25, unitPrice: 1999, totalPrice: 49975, supplier: 'Dell中国', priority: 'medium', status: 'rejected' },
  { id: 6, product: '无线键盘鼠标套装', category: '办公设备', currentStock: 40, requiredQuantity: 70, suggestedQuantity: 35, unitPrice: 299, totalPrice: 10465, supplier: '罗技科技', priority: 'low', status: 'pending' },
];

const approvalProcess: ApprovalProcess[] = [
  { id: 1, step: '采购申请', user: '张三', department: '技术部', status: 'completed', time: '2026-02-25 10:30' },
  { id: 2, step: '部门审批', user: '李四', department: '技术部', status: 'completed', time: '2026-02-25 14:20' },
  { id: 3, step: '财务审核', user: '王五', department: '财务部', status: 'pending', time: '待处理' },
  { id: 4, step: '采购执行', user: '赵六', department: '采购部', status: 'pending', time: '待处理' },
];

const chartData = {
  priorityDistribution: [
    { name: '高优先级', value: 35, color: '#f44336' },
    { name: '中优先级', value: 45, color: '#ffc107' },
    { name: '低优先级', value: 20, color: '#4caf50' },
  ],
  categoryDistribution: [
    { name: '电子元器件', value: 60, color: '#00b4d8' },
    { name: '电子产品', value: 25, color: '#1976d2' },
    { name: '办公设备', value: 15, color: '#f57c00' },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function MRPSuggestionsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPriorityDistributionOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.priorityDistribution.map(item => item.name),
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
        data: chartData.priorityDistribution.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: (params: any) => chartData.priorityDistribution[params.dataIndex].color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const getCategoryDistributionOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.categoryDistribution.map(item => item.name),
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
        data: chartData.categoryDistribution.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: (params: any) => chartData.categoryDistribution[params.dataIndex].color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const toggleSuggestionSelection = (suggestionId: number) => {
    setSelectedSuggestions(prev =>
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId],
    );
  };

  const filteredSuggestions = filterPriority === 'all'
    ? suggestions
    : suggestions.filter(suggestion => suggestion.priority === filterPriority);

  const handleApprove = () => {
    alert('已批准选中的采购建议');
    setSelectedSuggestions([]);
  };

  const handleReject = () => {
    alert('已拒绝选中的采购建议');
    setSelectedSuggestions([]);
  };

  const handleBatchProcess = () => {
    alert('批量处理功能待实现');
  };

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              采购建议管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">采购建议列表 · 审批流程 · 批量处理</p>
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
              placeholder="搜索产品名称、供应商..."
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
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="all">全部状态</option>
            <option value="pending">待审批</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
          </select>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* 采购建议列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>采购建议</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              建议列表
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共找到 <span className="text-cyan-400 font-bold">{filteredSuggestions.length}</span> 条建议
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.length === filteredSuggestions.length && filteredSuggestions.length > 0}
                    onChange={(e) =>
                      setSelectedSuggestions(
                        e.target.checked
                          ? filteredSuggestions.map(s => s.id)
                          : [],
                      )
                    }
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品名称</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">类别</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">当前库存</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">建议采购量</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">单价</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">总金额</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">供应商</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">优先级</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuggestions.map((suggestion) => (
                <tr
                  key={suggestion.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedSuggestions.includes(suggestion.id)}
                      onChange={() => toggleSuggestionSelection(suggestion.id)}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {suggestion.product}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                      {suggestion.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {suggestion.currentStock}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      {suggestion.suggestedQuantity}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      ¥{suggestion.unitPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      ¥{suggestion.totalPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {suggestion.supplier}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: suggestion.priority === 'high' ? 'rgba(244,67,54,0.15)' : suggestion.priority === 'medium' ? 'rgba(255,193,7,0.15)' : 'rgba(76,175,80,0.15)',
                        border: '1px solid ' + (suggestion.priority === 'high' ? 'rgba(244,67,54,0.3)' : suggestion.priority === 'medium' ? 'rgba(255,193,7,0.3)' : 'rgba(76,175,80,0.3)'),
                        color: suggestion.priority === 'high' ? '#f44336' : suggestion.priority === 'medium' ? '#ffc107' : '#4caf50',
                      }}
                    >
                      {suggestion.priority === 'high' ? '高' : suggestion.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                      style={{
                        background: suggestion.status === 'approved' ? 'rgba(76,175,80,0.15)' : suggestion.status === 'rejected' ? 'rgba(244,67,54,0.15)' : 'rgba(0,180,216,0.15)',
                        border: '1px solid ' + (suggestion.status === 'approved' ? 'rgba(76,175,80,0.3)' : suggestion.status === 'rejected' ? 'rgba(244,67,54,0.3)' : 'rgba(0,180,216,0.3)'),
                        color: suggestion.status === 'approved' ? '#4caf50' : suggestion.status === 'rejected' ? '#f44336' : colors.cyan,
                      }}
                    >
                      {suggestion.status === 'approved' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : suggestion.status === 'rejected' ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {suggestion.status === 'approved' ? '已批准' : suggestion.status === 'rejected' ? '已拒绝' : '待审批'}
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
                      详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 批量处理与图表 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 批量处理 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>批量处理</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            操作选项
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                已选择 <span className="text-cyan-400 font-bold">{selectedSuggestions.length}</span> 项
              </div>
              <button
                onClick={() => setSelectedSuggestions([])}
                className="text-xs text-red-400 hover:text-red-300"
              >
                清除
              </button>
            </div>

            <button
              onClick={handleApprove}
              disabled={selectedSuggestions.length === 0}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: selectedSuggestions.length > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedSuggestions.length > 0 ? '1px solid rgba(76,175,80,0.3)' : '1px solid rgba(255,255,255,0.05)',
                color: selectedSuggestions.length > 0 ? '#4caf50' : 'rgba(255,255,255,0.3)',
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              批量批准
            </button>

            <button
              onClick={handleReject}
              disabled={selectedSuggestions.length === 0}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: selectedSuggestions.length > 0 ? 'rgba(244,67,54,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedSuggestions.length > 0 ? '1px solid rgba(244,67,54,0.3)' : '1px solid rgba(255,255,255,0.05)',
                color: selectedSuggestions.length > 0 ? '#f44336' : 'rgba(255,255,255,0.3)',
              }}
            >
              <XCircle className="w-4 h-4" />
              批量拒绝
            </button>

            <button
              onClick={handleBatchProcess}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,193,7,0.15)',
                border: '1px solid rgba(255,193,7,0.3)',
                color: '#ffc107',
              }}
            >
              <MoreVertical className="w-4 h-4" />
              更多操作
            </button>
          </div>
        </div>

        {/* 审批流程 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>审批流程</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            当前审批进度
          </h2>

          <div className="space-y-3">
            {approvalProcess.map((step) => (
              <div
                key={step.id}
                className="rounded-lg p-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                    {step.step}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: step.status === 'completed' ? 'rgba(76,175,80,0.15)' : step.status === 'pending' ? 'rgba(0,180,216,0.15)' : 'rgba(244,67,54,0.15)',
                      border: '1px solid ' + (step.status === 'completed' ? 'rgba(76,175,80,0.3)' : step.status === 'pending' ? 'rgba(0,180,216,0.3)' : 'rgba(244,67,54,0.3)'),
                      color: step.status === 'completed' ? '#4caf50' : step.status === 'pending' ? colors.cyan : '#f44336',
                    }}
                  >
                    {step.status === 'completed' ? '已完成' : step.status === 'pending' ? '进行中' : '已拒绝'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  处理人: {step.user} ({step.department})
                </div>
                <div className="text-xs text-gray-400">
                  时间: {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 优先级分布 */}
        <div className="col-span-1 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>优先级分布</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            采购建议分布
          </h2>
          <ReactECharts option={getPriorityDistributionOption()} style={{ height: '200px', width: '100%' }} />
        </div>
      </div>

      {/* 类别分布 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>类别分布</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          产品类别占比
        </h2>
        <ReactECharts option={getCategoryDistributionOption()} style={{ height: '250px', width: '100%' }} />
      </div>
    </div>
  );
}
