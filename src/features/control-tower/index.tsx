// 集成供应链（ISC）计划管理控制塔
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

// 类型定义
interface KPIData {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendText?: string;
  status?: 'ok' | 'warn' | 'normal';
}

interface DefenseWall {
  id: number;
  title: string;
  description: string;
  layer: 'prevent' | 'buffer' | 'response';
  tags: string[];
  metrics: { label: string; value: string; color: string };
}

interface SCORMetric {
  name: string;
  value: number;
  benchmark: number;
  color: string;
}

// 模拟数据 - 可替换为API调用
const headerStats = {
  planAchieve: '98.2%',
  avgDelivery: '4.2天',
  riskLevel: 'S3',
  period: '2026/02'
};

const kpiData: KPIData[] = [
  { label: '订单交付准时率 (OTD)', value: '96.8%', trend: 'up', trendText: '+1.2% vs 上月', status: 'ok' },
  { label: '库存周转天数 (DOI)', value: '18.4', trend: 'down', trendText: '-2天 优化中', status: 'warn' },
  { label: '预测准确率 (FA)', value: '99.1%', trend: 'up', trendText: '+0.8%', status: 'ok' },
  { label: '供应商异常率 (SQR)', value: '4.6%', trend: 'stable', trendText: '→ 持平', status: 'normal' },
  { label: '产能利用率 (CU)', value: '87.3%', trend: 'up', trendText: '+3.1%', status: 'ok' },
  { label: '紧急物料缺货率', value: '2.1%', trend: 'down', trendText: '▼ 需关注', status: 'warn' },
];

const pyramidLayers = [
  { level: '战略层 · 1-3年', name: '长期规划与资源配置', desc: '基于市场趋势和商业战略，制定长期预望与资源配置方案。', tags: ['市场趋势分析', '网络设计', '资源配置', 'Make/Buy'], color: 'orange' },
  { level: '战术层 · 3-18个月', name: '中期平衡与容量规划', desc: '滚动计划周期内，平衡供需关系，管理产能约束。', tags: ['产能规划', '库存策略', '产品组合', 'S&OP输入'], color: 'blue' },
  { level: '执行层 · 周/日作业', name: '即时响应与实时物流', desc: '按主计划分解执行，响应实时变化，驱动调度。', tags: ['详细排程', '派工单', '实时物流', '异常处理'], color: 'teal' }
];

const sopSteps = [
  { icon: '📊', title: '数据收集', desc: '销售、财务、数据汇总' },
  { icon: '📈', title: '需求计划', desc: '供需财务全局平衡' },
  { icon: '🏭', title: '供应计划', desc: '生产路径库产规划' },
  { icon: '🤝', title: '高管决策', desc: '跨职能共识确认' }
];

const mpsZones = [
  { name: '冻结区', icon: '🔒', desc: '保护即时生产', status: 'frozen' },
  { name: '泥泞区', icon: '⚠️', desc: '可商充裕次性', status: 'slushy' },
  { name: '自由区', icon: '🌐', desc: '开放未来调整', status: 'free' }
];

const defenseWalls: DefenseWall[] = [
  { id: 1, title: '需求预测', layer: 'prevent', description: '运用统计算法、机器学习及CPFR，从源头降低需求不确定性。', tags: ['统计预测', 'AI建模', 'CPFR协同'], metrics: { label: '缺货率', value: '4.2%', color: 'cyan' } },
  { id: 2, title: '安全库存', layer: 'buffer', description: '基于服务水平目标与需求波动性，计算各SKU安全库存。', tags: ['服务水平 SL', '波动系数 CV', '安全库存模型'], metrics: { label: '服务水平', value: '98.6%', color: 'green' } },
  { id: 3, title: '执行响应', layer: 'response', description: '建立实时异常监控与快速响应机制，驱动跨职能协同。', tags: ['实时监控', '异常预警', '跨职能协同'], metrics: { label: '安全系数', value: '1.8x', color: 'orange' } }
];

const deliveryModes = [
  { code: 'MTS', name: 'Make-to-Stock', icon: '📦', type: 'mts' },
  { code: 'MTO', name: 'Make-to-Order', icon: '🔄', type: 'mts' },
  { code: 'CODP', name: '服务跳脱耦点', icon: '⚓', type: 'dp' },
  { code: 'ATO', name: 'Assemble-to-Order', icon: '⚙️', type: 'eto' },
  { code: 'ETO', name: 'Engineer-to-Order', icon: '📐', type: 'eto' }
];

const scorData: SCORMetric[] = [
  { name: '可靠性 RL', value: 96, benchmark: 85, color: '#42a5f5' },
  { name: '响应性 RS', value: 82, benchmark: 80, color: '#26a69a' },
  { name: '敏捷性 AG', value: 75, benchmark: 80, color: '#ff9800' },
  { name: '成本 CO', value: 88, benchmark: 85, color: '#ab47bc' },
  { name: '资产效率 AM', value: 91, benchmark: 85, color: '#ef5350' }
];

const fourPillars = [
  { icon: '🔄', title: '流程 Process', sub: 'STOR逻辑', desc: '业务最佳实践固化，确保端到端流程标准化', color: 'cyan' },
  { icon: '🗄️', title: '数据 Data', sub: 'BOM / 主数据', desc: '确保执行的准确性与一致性，构建数据治理', color: 'orange' },
  { icon: '💻', title: '系统 System', sub: 'IT工具链', desc: '数字化驱动效率提升，ERP/APS/WMS集成', color: 'purple' },
  { icon: '👥', title: '组织 Org', sub: 'S&OP协同', desc: '确保改变方案落地执行，建立协同文化', color: 'green' }
];

const colors = { navy: '#0a1628', cyan: '#00b4d8', orange: '#f57c00', cardBg: 'rgba(255,255,255,0.04)', border: 'rgba(0,180,216,0.2)' };

export default function ControlTower() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const getRadarOption = () => ({
    radar: {
      indicator: scorData.map(s => ({ name: s.name, max: 100 })),
      radius: '60%', center: ['50%', '55%'],
      axisName: { color: '#b0bec5', fontSize: 9 },
      splitArea: { areaStyle: { color: ['rgba(0,180,216,0.02)', 'rgba(0,180,216,0.04)', 'rgba(0,180,216,0.06)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.07)' } }
    },
    series: [{
      type: 'radar',
      data: [
        { value: scorData.map(s => s.value), name: '实际', areaStyle: { color: 'rgba(0,180,216,0.15)' }, lineStyle: { color: 'rgba(0,180,216,0.8)', width: 2 }, itemStyle: { color: '#00b4d8' } },
        { value: scorData.map(s => s.benchmark), name: '基准', lineStyle: { color: 'rgba(255,200,0,0.5)', width: 1, type: 'dashed' as const }, itemStyle: { color: 'rgba(255,200,0,0.8)' } }
      ]
    }],
    legend: { show: false }
  });

  return (
    <div className="min-h-screen p-6" style={{ background: colors.navy, backgroundImage: 'linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* Header */}
      <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(21,101,192,0.3), rgba(0,180,216,0.1))', border: '1px solid ' + colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(90deg, #00b4d8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              集成供应链（ISC）计划管理控制塔
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Integrated Supply Chain Planning Control Tower · 从战略到执行</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}>
              <div className="text-xl font-bold text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{headerStats.planAchieve}</div>
              <div className="text-xs text-gray-400">计划达成率</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}>
              <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f57c00' }}>{headerStats.avgDelivery}</div>
              <div className="text-xs text-gray-400">平均交付周期</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}>
              <div className="text-xl font-bold text-green-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{headerStats.riskLevel}</div>
              <div className="text-xs text-gray-400">风险等级</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid ' + colors.border }}>
              <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}><span className="text-sm">2026</span>/02</div>
              <div className="text-xs text-gray-400">当前周期</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="rounded-lg p-3 text-center" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', background: kpi.status === 'ok' ? 'linear-gradient(135deg, #66bb6a, #26a69a)' : kpi.status === 'warn' ? 'linear-gradient(135deg, #f57c00, #ffc107)' : 'linear-gradient(135deg, #00b4d8, #1976d2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{kpi.value}</div>
            <div className="text-xs text-gray-400 mt-1">{kpi.label}</div>
            <div className={'text-xs mt-2 inline-block px-2 py-0.5 rounded ' + (kpi.trend === 'up' ? 'bg-green-500/20 text-green-400' : kpi.trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400')}>
              {kpi.trend === 'up' ? '▲ ' : kpi.trend === 'down' ? '▼ ' : '→ '}{kpi.trendText}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card 1: 三层计划体系 */}
        <div className="row-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>三层计划体系</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">🔺</span>
            <span className="font-semibold tracking-wide">从愿景到动作</span>
          </div>
          <div className="space-y-3">
            {pyramidLayers.map((layer, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-1.5 rounded-full flex-shrink-0" style={{ background: layer.color === 'orange' ? 'linear-gradient(180deg, #f57c00, #ff9800)' : layer.color === 'blue' ? 'linear-gradient(180deg, #1565c0, #42a5f5)' : 'linear-gradient(180deg, #00897b, #26a69a)' }} />
                <div className="flex-1 rounded-lg p-3" style={{ background: layer.color === 'orange' ? 'rgba(245,124,0,0.08)' : layer.color === 'blue' ? 'rgba(21,101,192,0.1)' : 'rgba(0,137,123,0.08)' }}>
                  <div className="text-xs inline-block px-2 py-0.5 rounded-full mb-1" style={{ background: layer.color === 'orange' ? 'rgba(245,124,0,0.2)' : layer.color === 'blue' ? 'rgba(21,101,192,0.2)' : 'rgba(0,137,123,0.2)', color: layer.color === 'orange' ? '#ff9800' : layer.color === 'blue' ? '#42a5f5' : '#26a69a', border: '1px solid ' + (layer.color === 'orange' ? 'rgba(245,124,0,0.3)' : layer.color === 'blue' ? 'rgba(21,101,192,0.3)' : 'rgba(0,137,123,0.3)') }}>{layer.level}</div>
                  <div className="font-bold text-sm text-white mb-1">{layer.name}</div>
                  <div className="text-xs text-gray-400">{layer.desc}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {layer.tags.map((tag, i) => (<span key={i} className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{tag}</span>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: S&OP */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>产销协同</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">⚙️</span>
            <span className="font-semibold tracking-wide">S&OP 节拍器</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
            {sopSteps.map((step, idx) => (<React.Fragment key={idx}><div className="flex-1 text-center rounded-lg py-2 bg-white/5 border border-white/10"><div className="text-lg mb-1">{step.icon}</div><div className="text-xs font-bold text-cyan-400">{step.title}</div><div className="text-[9px] text-gray-400">{step.desc}</div></div>{idx < sopSteps.length - 1 && <span className="text-orange-400 text-lg">→</span>}</React.Fragment>))}
          </div>
          <div className="flex justify-center gap-2">
            {['数据层', '需求评审', '供应评审', '财务整合'].map((step, idx) => (<span key={idx} className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: idx === 0 ? 'rgba(0,180,216,0.15)' : idx === 1 ? 'rgba(245,124,0,0.15)' : idx === 2 ? 'rgba(76,175,80,0.15)' : 'rgba(156,39,176,0.15)', border: '1px solid ' + (idx === 0 ? 'rgba(0,180,216,0.3)' : idx === 1 ? 'rgba(245,124,0,0.3)' : idx === 2 ? 'rgba(76,175,80,0.3)' : 'rgba(156,39,176,0.3)'), color: idx === 0 ? '#00b4d8' : idx === 1 ? '#f57c00' : idx === 2 ? '#81c784' : '#ce93d8' }}>{step}</span>))}
          </div>
        </div>

        {/* Card 3: MPS */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>主计划</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">🔐</span>
            <span className="font-semibold tracking-wide">MPS 枢纽作用</span>
          </div>
          <div className="flex gap-2 mb-3">
            {mpsZones.map((zone, idx) => (<div key={idx} className="flex-1 text-center rounded-lg py-2" style={{ border: '1px solid ' + (zone.status === 'frozen' ? 'rgba(0,180,216,0.4)' : zone.status === 'slushy' ? 'rgba(245,124,0,0.4)' : 'rgba(76,175,80,0.4)'), background: zone.status === 'frozen' ? 'rgba(0,180,216,0.08)' : zone.status === 'slushy' ? 'rgba(245,124,0,0.08)' : 'rgba(76,175,80,0.08)' }}><div className="text-xl mb-1">{zone.icon}</div><div className="text-xs font-bold" style={{ color: zone.status === 'frozen' ? '#00b4d8' : zone.status === 'slushy' ? '#f57c00' : '#81c784' }}>{zone.name}</div><div className="text-[9px] text-gray-400">{zone.desc}</div></div>))}
          </div>
          <div className="h-1.5 rounded-full flex overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: '25%' }} /><div className="h-full bg-orange-400" style={{ width: '35%' }} /><div className="h-full bg-green-400" style={{ width: '40%' }} /></div>
          <div className="flex justify-between mt-1 text-[9px] text-gray-400"><span>T+0</span><span>▶ 隔离市场波动</span><span>T+18M</span></div>
        </div>

        {/* Card 4: 风险管理 */}
        <div className="row-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>风险管理</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">🛡️</span>
            <span className="font-semibold tracking-wide">三道防线体系</span>
          </div>
          <div className="space-y-2">
            {defenseWalls.map((wall) => (
              <div key={wall.id} className="rounded-lg overflow-hidden border" style={{ borderColor: wall.layer === 'prevent' ? 'rgba(0,180,216,0.4)' : wall.layer === 'buffer' ? 'rgba(245,124,0,0.4)' : 'rgba(76,175,80,0.4)' }}>
                <div className="h-8 flex items-center px-3 gap-2" style={{ background: wall.layer === 'prevent' ? 'repeating-linear-gradient(90deg, rgba(0,180,216,0.18) 0px, rgba(0,180,216,0.18) 34px, rgba(0,180,216,0.06) 34px, rgba(0,180,216,0.06) 36px)' : wall.layer === 'buffer' ? 'repeating-linear-gradient(90deg, rgba(245,124,0,0.18) 0px, rgba(245,124,0,0.18) 34px, rgba(245,124,0,0.06) 34px, rgba(245,124,0,0.06) 36px)' : 'repeating-linear-gradient(90deg, rgba(76,175,80,0.18) 0px, rgba(76,175,80,0.18) 34px, rgba(76,175,80,0.06) 34px, rgba(76,175,80,0.06) 36px)' }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center text-lg font-bold" style={{ background: wall.layer === 'prevent' ? 'rgba(0,180,216,0.25)' : wall.layer === 'buffer' ? 'rgba(245,124,0,0.25)' : 'rgba(76,175,80,0.25)', color: wall.layer === 'prevent' ? '#00b4d8' : wall.layer === 'buffer' ? '#f57c00' : '#81c784', border: '1px solid ' + (wall.layer === 'prevent' ? 'rgba(0,180,216,0.5)' : wall.layer === 'buffer' ? 'rgba(245,124,0,0.5)' : 'rgba(76,175,80,0.5)') }}>{wall.id}</div>
                  <div className="text-sm font-bold flex-1" style={{ color: wall.layer === 'prevent' ? '#00b4d8' : wall.layer === 'buffer' ? '#f57c00' : '#81c784', fontFamily: 'Rajdhani, sans-serif' }}>{wall.title}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: wall.layer === 'prevent' ? 'rgba(0,180,216,0.15)' : wall.layer === 'buffer' ? 'rgba(245,124,0,0.15)' : 'rgba(76,175,80,0.15)', border: '1px solid ' + (wall.layer === 'prevent' ? 'rgba(0,180,216,0.3)' : wall.layer === 'buffer' ? 'rgba(245,124,0,0.3)' : 'rgba(76,175,80,0.3)'), color: wall.layer === 'prevent' ? '#00b4d8' : wall.layer === 'buffer' ? '#f57c00' : '#81c784' }}>{wall.layer === 'prevent' ? '预防层' : wall.layer === 'buffer' ? '缓冲层' : '响应层'}</span>
                </div>
                <div className="p-3 bg-black/20">
                  <div className="text-xs text-gray-400 mb-2">{wall.description}</div>
                  <div className="flex flex-wrap gap-1">{wall.tags.map((tag, i) => (<span key={i} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{tag}</span>))}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {defenseWalls.map((wall) => (<div key={wall.id} className="text-center p-2 rounded-lg bg-white/5 border border-white/10"><div className="text-lg font-bold" style={{ color: wall.metrics.color === 'cyan' ? '#00b4d8' : wall.metrics.color === 'green' ? '#81c784' : '#f57c00', fontFamily: 'Rajdhani, sans-serif' }}>{wall.metrics.value}</div><div className="text-[9px] text-gray-400">{wall.metrics.label}</div></div>))}
          </div>
        </div>

        {/* Card 5: 交付模式 */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>差异化交付</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">🚚</span>
            <span className="font-semibold tracking-wide">MTS → ETO 模式谱系</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {deliveryModes.map((mode, idx) => (<React.Fragment key={mode.code}><div className="flex-1 text-center rounded-lg py-2" style={{ border: '1px solid ' + (mode.type === 'mts' ? 'rgba(0,180,216,0.3)' : mode.type === 'dp' ? 'rgba(245,124,0,0.5)' : 'rgba(76,175,80,0.3)'), background: mode.type === 'mts' ? 'rgba(0,180,216,0.07)' : mode.type === 'dp' ? 'rgba(245,124,0,0.1)' : 'rgba(76,175,80,0.07)' }}><div className="text-lg mb-1">{mode.icon}</div><div className="text-xs font-bold" style={{ color: mode.type === 'mts' ? '#00b4d8' : mode.type === 'dp' ? '#f57c00' : '#81c784', fontFamily: 'Rajdhani, sans-serif' }}>{mode.code}</div><div className="text-[9px] text-gray-400">{mode.name}</div></div>{idx < deliveryModes.length - 1 && <span className="text-orange-400 text-sm">→</span>}</React.Fragment>))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg p-2" style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.2)' }}><div className="text-xs font-bold text-cyan-400 mb-1">推式 PUSH</div><div className="text-xs text-gray-400">基于预测驱动，低交期</div></div>
            <div className="flex-1 rounded-lg p-2" style={{ background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.2)' }}><div className="text-xs font-bold text-green-400 mb-1">拉式 PULL</div><div className="text-xs text-gray-400">基于订单驱动，高灵活</div></div>
          </div>
        </div>

        {/* Card 6: SCOR雷达图 */}
        <div className="rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>绩效度量</div>
          <div className="flex items-center gap-2 mb-2 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">📡</span>
            <span className="font-semibold tracking-wide">SCOR 五大指标雷达</span>
          </div>
          <ReactECharts option={getRadarOption()} style={{ height: '160px', width: '100%' }} />
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {scorData.map((s, idx) => (<div key={idx} className="flex items-center gap-1 text-xs text-gray-400"><div className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name.split(' ')[0]} · {s.value}%</div>))}
          </div>
        </div>

        {/* Card 7: 四大支柱 */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: colors.cardBg, border: '1px solid ' + colors.border }}>
          <div className="text-xs text-orange-400 mb-2 tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>底层逻辑</div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">🏛️</span>
            <span className="font-semibold tracking-wide">四大支撑支柱</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {fourPillars.map((pillar, idx) => (
              <div key={idx} className="rounded-lg p-3 bg-white/5 border border-white/10 hover:-translate-y-1 transition-all" style={{ borderTop: '2px solid ' + pillar.color }}>
                <div className="text-xl mb-2">{pillar.icon}</div>
                <div className="text-sm font-bold mb-1" style={{ color: pillar.color }}>{pillar.title}</div>
                <div className="text-xs text-gray-400 mb-2">{pillar.sub}</div>
                <div className="text-xs text-gray-500 leading-tight">{pillar.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
