// AI采购建议页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ChevronRight, Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';

// 类型定义
interface Supplier {
  id: number;
  name: string;
  category: string;
  score: number;
  price: number;
  deliveryTime: number;
  reliability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface NegotiationHistory {
  id: number;
  supplier: string;
  product: string;
  date: string;
  price: number;
  previousPrice: number;
  status: 'success' | 'pending' | 'failed';
}

// 模拟数据
const suppliers: Supplier[] = [
  { id: 1, name: '华为技术有限公司', category: '电子元器件', score: 95, price: 125.5, deliveryTime: 3, reliability: 98, riskLevel: 'low' },
  { id: 2, name: '腾讯云服务', category: '云计算服务', score: 92, price: 89.0, deliveryTime: 2, reliability: 95, riskLevel: 'low' },
  { id: 3, name: '阿里巴巴供应链', category: '物流服务', score: 88, price: 65.8, deliveryTime: 4, reliability: 92, riskLevel: 'medium' },
  { id: 4, name: '小米供应链', category: '电子产品', score: 85, price: 110.0, deliveryTime: 5, reliability: 88, riskLevel: 'medium' },
  { id: 5, name: '字节跳动科技', category: 'AI服务', score: 90, price: 150.0, deliveryTime: 3, reliability: 94, riskLevel: 'low' },
  { id: 6, name: '百度智能云', category: 'AI服务', score: 87, price: 135.0, deliveryTime: 4, reliability: 90, riskLevel: 'medium' },
];

const negotiationHistory: NegotiationHistory[] = [
  { id: 1, supplier: '华为技术有限公司', product: 'CPU芯片', date: '2026-02-27', price: 125.5, previousPrice: 135.0, status: 'success' },
  { id: 2, supplier: '腾讯云服务', product: '云服务器', date: '2026-02-26', price: 89.0, previousPrice: 95.0, status: 'success' },
  { id: 3, name: '阿里巴巴供应链', product: '物流配送', date: '2026-02-25', price: 65.8, previousPrice: 70.0, status: 'pending' },
  { id: 4, supplier: '小米供应链', product: '智能手机', date: '2026-02-24', price: 110.0, previousPrice: 120.0, status: 'success' },
  { id: 5, supplier: '字节跳动科技', product: 'AI算法', date: '2026-02-23', price: 150.0, previousPrice: 160.0, status: 'failed' },
];

const chartData = {
  procurementAnalysis: [
    { name: '1月', value: 85000 },
    { name: '2月', value: 92000 },
    { name: '3月', value: 88000 },
    { name: '4月', value: 95000 },
    { name: '5月', value: 102000 },
    { name: '6月', value: 98000 },
  ],
  categoryBreakdown: [
    { name: '电子元器件', value: 45 },
    { name: '云计算服务', value: 25 },
    { name: '物流服务', value: 18 },
    { name: 'AI服务', value: 12 },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function ProcurementPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProcurementAnalysisOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.procurementAnalysis.map(item => item.name),
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
        data: chartData.procurementAnalysis.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00b4d8' },
            { offset: 1, color: '#1976d2' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const getCategoryBreakdownOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 20, containLabel: true },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}%',
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#b0bec5', fontSize: 10 },
    },
    series: [
      {
        name: '采购分类',
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
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        data: chartData.categoryBreakdown.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: index === 0 ? '#00b4d8' : index === 1 ? '#1976d2' : index === 2 ? '#f57c00' : '#4caf50',
          },
        })),
      },
    ],
  });

  const toggleSupplierSelection = (supplierId: number) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId],
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* 页面头部 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              AI 采购建议
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">智能推荐供应商 · 议价历史 · 采购分析图表</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
              <Download className="w-4 h-4" />
              导出报表
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(245,124,0,0.15)', border: '1px solid rgba(245,124,0.3)', color: colors.orange }}>
              <Plus className="w-4 h-4" />
              新增采购
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
              placeholder="搜索供应商名称、产品类别..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="">全部类别</option>
            <option value="electronics">电子元器件</option>
            <option value="cloud">云计算服务</option>
            <option value="logistics">物流服务</option>
            <option value="ai">AI服务</option>
          </select>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="">风险等级</option>
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

      {/* 供应商推荐 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 智能推荐供应商 */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>智能推荐</div>
              <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
                供应商推荐列表
              </h2>
            </div>
            <div className="text-xs text-gray-400">
              共找到 <span className="text-cyan-400 font-bold">{suppliers.length}</span> 个供应商
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.length === suppliers.length}
                      onChange={(e) => setSelectedSuppliers(e.target.checked ? suppliers.map(s => s.id) : [])}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">供应商名称</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品类别</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">评分</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">价格</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">交付时间</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">可靠性</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">风险等级</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => toggleSupplierSelection(supplier.id)}
                        className="rounded border-gray-400 text-cyan-400"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                        {supplier.name}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                        {supplier.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold" style={{ color: colors.cyan }}>
                          {supplier.score}
                        </div>
                        <div className="w-16 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${supplier.score}%`,
                              background: supplier.score >= 90 ? 'linear-gradient(90deg, #4caf50, #81c784)' : supplier.score >= 80 ? 'linear-gradient(90deg, #ffc107, #ff9800)' : 'linear-gradient(90deg, #f44336, #e57373)',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                        ¥{supplier.price.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm" style={{ color: '#e8edf4' }}>
                        {supplier.deliveryTime}天
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                        {supplier.reliability}%
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: supplier.riskLevel === 'low' ? 'rgba(76,175,80,0.15)' : supplier.riskLevel === 'medium' ? 'rgba(245,124,0.15)' : 'rgba(244,67,54,0.15)',
                          border: '1px solid ' + (supplier.riskLevel === 'low' ? 'rgba(76,175,80,0.3)' : supplier.riskLevel === 'medium' ? 'rgba(245,124,0.3)' : 'rgba(244,67,54,0.3)'),
                          color: supplier.riskLevel === 'low' ? '#4caf50' : supplier.riskLevel === 'medium' ? '#f57c00' : '#f44336',
                        }}
                      >
                        {supplier.riskLevel === 'low' ? '低风险' : supplier.riskLevel === 'medium' ? '中风险' : '高风险'}
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
                        选择 <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 议价历史与分析 */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>议价历史</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            最近议价记录
          </h2>

          <div className="space-y-3 mb-6">
            {negotiationHistory.map((negotiation) => (
              <div
                key={negotiation.id}
                className="rounded-lg p-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                    {negotiation.supplier}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: negotiation.status === 'success' ? 'rgba(76,175,80,0.15)' : negotiation.status === 'pending' ? 'rgba(255,200,0,0.15)' : 'rgba(244,67,54,0.15)',
                      border: '1px solid ' + (negotiation.status === 'success' ? 'rgba(76,175,80,0.3)' : negotiation.status === 'pending' ? 'rgba(255,200,0,0.3)' : 'rgba(244,67,54,0.3)'),
                      color: negotiation.status === 'success' ? '#4caf50' : negotiation.status === 'pending' ? '#ffc107' : '#f44336',
                    }}
                  >
                    {negotiation.status === 'success' ? '成功' : negotiation.status === 'pending' ? '进行中' : '失败'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-2">{negotiation.product}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {negotiation.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      ¥{negotiation.price.toFixed(1)}
                    </div>
                    {negotiation.price < negotiation.previousPrice && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {(((negotiation.previousPrice - negotiation.price) / negotiation.previousPrice) * 100).toFixed(1)}%
                      </span>
                    )}
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
            查看全部历史 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 采购分析图表 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>采购趋势</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            采购金额月度分析
          </h2>
          <ReactECharts option={getProcurementAnalysisOption()} style={{ height: '250px', width: '100%' }} />
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>类别分布</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            采购类别占比
          </h2>
          <ReactECharts option={getCategoryBreakdownOption()} style={{ height: '250px', width: '100%' }} />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between rounded-xl p-4" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            已选择 <span className="text-cyan-400 font-bold">{selectedSuppliers.length}</span> 个供应商
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8edf4',
            }}
          >
            清除选择
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{
              background: 'rgba(0,180,216,0.15)',
              border: '1px solid rgba(0,180,216,0.3)',
              color: colors.cyan,
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            确认采购
          </button>
        </div>
      </div>
    </div>
  );
}
