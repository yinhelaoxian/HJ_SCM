// 合同管理页面
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { FileText, Calendar, DollarSign, CheckCircle, AlertTriangle, Search, Filter, Download, MoreVertical } from 'lucide-react';

// 类型定义
interface Contract {
  id: number;
  supplier: string;
  contractNumber: string;
  product: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending' | 'terminated';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  riskLevel: 'low' | 'medium' | 'high';
}

interface PaymentRecord {
  id: number;
  contractNumber: string;
  amount: number;
  paymentDate: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
}

// 模拟数据
const contracts: Contract[] = [
  { id: 1, supplier: '华为技术有限公司', contractNumber: 'CT-2026-001', product: '电子元器件采购', amount: 1250000, startDate: '2026-01-15', endDate: '2026-12-31', status: 'active', paymentStatus: 'paid', riskLevel: 'low' },
  { id: 2, supplier: '腾讯云服务', contractNumber: 'CT-2026-002', product: '云计算服务', amount: 890000, startDate: '2026-02-01', endDate: '2027-01-31', status: 'active', paymentStatus: 'pending', riskLevel: 'low' },
  { id: 3, supplier: '阿里巴巴供应链', contractNumber: 'CT-2026-003', product: '物流服务', amount: 658000, startDate: '2025-10-01', endDate: '2026-09-30', status: 'active', paymentStatus: 'overdue', riskLevel: 'medium' },
  { id: 4, supplier: '小米供应链', contractNumber: 'CT-2026-004', product: '电子产品', amount: 1100000, startDate: '2026-01-01', endDate: '2026-06-30', status: 'pending', paymentStatus: 'pending', riskLevel: 'medium' },
  { id: 5, supplier: '字节跳动科技', contractNumber: 'CT-2025-012', product: 'AI服务', amount: 1500000, startDate: '2025-03-01', endDate: '2026-02-28', status: 'expired', paymentStatus: 'paid', riskLevel: 'low' },
  { id: 6, supplier: '百度智能云', contractNumber: 'CT-2026-005', product: 'AI服务', amount: 1350000, startDate: '2026-02-15', endDate: '2026-11-30', status: 'active', paymentStatus: 'paid', riskLevel: 'high' },
];

const paymentRecords: PaymentRecord[] = [
  { id: 1, contractNumber: 'CT-2026-001', amount: 1250000, paymentDate: '2026-01-15', status: 'success', method: '银行转账' },
  { id: 2, contractNumber: 'CT-2026-002', amount: 890000, paymentDate: '2026-02-28', status: 'pending', method: '支付宝' },
  { id: 3, contractNumber: 'CT-2026-003', amount: 658000, paymentDate: '2026-02-20', status: 'failed', method: '银行转账' },
  { id: 4, contractNumber: 'CT-2025-012', amount: 1500000, paymentDate: '2025-03-01', status: 'success', method: '微信支付' },
];

const chartData = {
  contractStatus: [
    { name: '有效', value: 4, color: '#00b4d8' },
    { name: '待审批', value: 1, color: '#f57c00' },
    { name: '已过期', value: 1, color: '#7a8ba8' },
    { name: '已终止', value: 0, color: '#e53935' },
  ],
  paymentStatus: [
    { name: '已支付', value: 55, color: '#00897b' },
    { name: '待支付', value: 30, color: '#f57c00' },
    { name: '逾期', value: 15, color: '#e53935' },
  ],
};

const colors = {
  navy: '#0a1628',
  cyan: '#00b4d8',
  orange: '#f57c00',
  cardBg: 'rgba(255,255,255,0.04)',
  border: 'rgba(0,180,216,0.2)',
};

export default function SupplierContractsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getContractStatusOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.contractStatus.map(item => item.name),
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
        data: chartData.contractStatus.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: (params: any) => chartData.contractStatus[params.dataIndex].color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const getPaymentStatusOption = () => ({
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.paymentStatus.map(item => item.name),
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
        data: chartData.paymentStatus.map(item => item.value),
        type: 'bar',
        itemStyle: {
          color: (params: any) => chartData.paymentStatus[params.dataIndex].color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  });

  const toggleContractSelection = (contractId: number) => {
    setSelectedContracts(prev =>
      prev.includes(contractId)
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId],
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
              供应商合同管理
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">合同生命周期 · 付款记录 · 风险监控</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: colors.cyan }}>
              <Download className="w-4 h-4" />
              导出报表
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(245,124,0.15)', border: '1px solid rgba(245,124,0.3)', color: colors.orange }}>
              <FileText className="w-4 h-4" />
              新建合同
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
              placeholder="搜索合同编号、供应商名称、产品..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}
            />
          </div>
          <select className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8edf4' }}>
            <option value="">全部状态</option>
            <option value="active">有效</option>
            <option value="expired">已过期</option>
            <option value="pending">待审批</option>
            <option value="terminated">已终止</option>
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

      {/* 合同列表 */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>合同管理</div>
            <h2 className="text-lg font-bold" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
              合同列表
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            共 {contracts.length} 份合同
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedContracts.length === contracts.length}
                    onChange={(e) => setSelectedContracts(e.target.checked ? contracts.map(c => c.id) : [])}
                    className="rounded border-gray-400 text-cyan-400"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">合同编号</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">供应商</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">产品</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">金额</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">开始日期</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">结束日期</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">支付状态</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">风险等级</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedContracts.includes(contract.id)}
                      onChange={() => toggleContractSelection(contract.id)}
                      className="rounded border-gray-400 text-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-sm" style={{ color: '#e8edf4' }}>
                      {contract.contractNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {contract.supplier}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: colors.cyan }}>
                      {contract.product}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                      ¥{(contract.amount / 10000).toFixed(1)}万
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {contract.startDate}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-sm" style={{ color: '#e8edf4' }}>
                      {contract.endDate}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: contract.status === 'active' ? 'rgba(0,180,216,0.15)' : contract.status === 'pending' ? 'rgba(245,124,0.15)' : contract.status === 'expired' ? 'rgba(122,139,168,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (contract.status === 'active' ? 'rgba(0,180,216,0.3)' : contract.status === 'pending' ? 'rgba(245,124,0.3)' : contract.status === 'expired' ? 'rgba(122,139,168,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: contract.status === 'active' ? colors.cyan : contract.status === 'pending' ? colors.orange : contract.status === 'expired' ? '#7a8ba8' : '#e53935',
                      }}
                    >
                      {contract.status === 'active' ? '有效' : contract.status === 'pending' ? '待审批' : contract.status === 'expired' ? '已过期' : '已终止'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: contract.paymentStatus === 'paid' ? 'rgba(0,137,123,0.15)' : contract.paymentStatus === 'pending' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (contract.paymentStatus === 'paid' ? 'rgba(0,137,123,0.3)' : contract.paymentStatus === 'pending' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: contract.paymentStatus === 'paid' ? '#00897b' : contract.paymentStatus === 'pending' ? colors.orange : '#e53935',
                      }}
                    >
                      {contract.paymentStatus === 'paid' ? '已支付' : contract.paymentStatus === 'pending' ? '待支付' : '逾期'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: contract.riskLevel === 'low' ? 'rgba(0,137,123,0.15)' : contract.riskLevel === 'medium' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                        border: '1px solid ' + (contract.riskLevel === 'low' ? 'rgba(0,137,123,0.3)' : contract.riskLevel === 'medium' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                        color: contract.riskLevel === 'low' ? '#00897b' : contract.riskLevel === 'medium' ? colors.orange : '#e53935',
                      }}
                    >
                      {contract.riskLevel === 'low' ? '低风险' : contract.riskLevel === 'medium' ? '中风险' : '高风险'}
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
                      <MoreVertical className="w-3 h-3" />
                      操作
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 支付记录与图表 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>支付记录</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            最近支付记录
          </h2>

          <div className="space-y-3">
            {paymentRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-lg p-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                    {record.contractNumber}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: record.status === 'success' ? 'rgba(0,137,123,0.15)' : record.status === 'pending' ? 'rgba(245,124,0.15)' : 'rgba(229,57,53,0.15)',
                      border: '1px solid ' + (record.status === 'success' ? 'rgba(0,137,123,0.3)' : record.status === 'pending' ? 'rgba(245,124,0.3)' : 'rgba(229,57,53,0.3)'),
                      color: record.status === 'success' ? '#00897b' : record.status === 'pending' ? colors.orange : '#e53935',
                    }}
                  >
                    {record.status === 'success' ? '成功' : record.status === 'pending' ? '处理中' : '失败'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {record.paymentDate} · {record.method}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#e8edf4' }}>
                    ¥{(record.amount / 10000).toFixed(1)}万
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>合同状态分析</div>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
            合同状态分布
          </h2>
          <ReactECharts option={getContractStatusOption()} style={{ height: '200px', width: '100%' }} />
        </div>
      </div>

      {/* 支付状态分析 */}
      <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
        <div className="text-xs text-orange-400 mb-1 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>支付状态分析</div>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.cyan, fontFamily: 'Rajdhani, sans-serif' }}>
          支付状态分布
        </h2>
        <ReactECharts option={getPaymentStatusOption()} style={{ height: '250px', width: '100%' }} />
      </div>
    </div>
  );
}
