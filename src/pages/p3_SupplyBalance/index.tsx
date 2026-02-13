import React, { useState } from 'react';
import { Factory, Zap, ArrowRight, Play } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../../config/demo.config';

const SCENARIOS = [
  { id: 'base', label: '当前基准', color: '#2D7DD2' },
  { id: 'A', label: 'A: Bühler断供6周', color: '#E53935' },
  { id: 'B', label: 'B: IKEA提前3周', color: '#F57C00' },
  { id: 'C', label: 'C: 泰国工厂支援', color: '#00897B' },
];

const WEEK_LABELS = Array.from({ length: 16 }, (_, i) => `W${40 + i}`);

const BASE_INVENTORY = [3840,3360,2880,2400,1920,1440,0,0,0,3600,7200,10800,10800,10800,10800,10800];
const BASE_PLANNED_PROD = [3600,3600,3600,3600,3600,3600,0,0,0,3600,3600,3600,3600,3600,3600,3600];
const DEMAND_DATA = [2800,3100,3400,8600,9200,11400,13800,12100,9800,7200,4300,2100,1800,1400,1200,1000];
const SAFETY_STOCK_LINE = Array(16).fill(8000);

function getScenarioData(scenario) {
  switch (scenario) {
    case 'A':
      return {
        inventory: BASE_INVENTORY.map((v, i) => i >= 4 ? 0 : v),
        planned: BASE_PLANNED_PROD.map((v, i) => (i >= 4 && i <= 9) ? 0 : v * 0.5),
        demand: DEMAND_DATA,
        gapMsg: '累计缺口 4.1万件 · 影响 ¥3,450万',
        gapColor: '#E53935',
      };
    case 'B':
      return {
        inventory: BASE_INVENTORY.map((v, i) => i >= 1 ? Math.max(0, v - 1500) : v),
        planned: BASE_PLANNED_PROD,
        demand: DEMAND_DATA.map((v, i) => i >= 1 && i <= 4 ? v * 1.6 : v),
        gapMsg: 'W40即出现新缺口 · 最早需11月1日前备货完毕',
        gapColor: '#F57C00',
      };
    case 'C':
      return {
        inventory: BASE_INVENTORY,
        planned: BASE_PLANNED_PROD.map(v => v + 800),
        demand: DEMAND_DATA,
        gapMsg: '缺口收窄至 0.6万件 · AI最优方案 ✓',
        gapColor: '#00897B',
      };
    default:
      return {
        inventory: BASE_INVENTORY,
        planned: BASE_PLANNED_PROD,
        demand: DEMAND_DATA,
        gapMsg: 'W46-W48出现断供风险 · 累计缺口 2.4万件',
        gapColor: '#E53935',
      };
  }
}

const AIPanelContent = {
  base: { items: [
    { title: '启动青岛恒达电机认证', impact: '14天完成，替代Bühler', urgency: '48h内', urgencyColor: '#E53935' },
    { title: '泰国工厂转产部分LA23', impact: '增产4,800件/月', urgency: '72h内', urgencyColor: '#F57C00' },
    { title: '追加Bühler交期确认', impact: '争取分批到货', urgency: '本周内', urgencyColor: '#7A8BA8' },
  ]},
  A: { items: [
    { title: '⚡ 紧急：苏州精驱认证', impact: '10天完成，唯一出路', urgency: '立即行动', urgencyColor: '#E53935' },
    { title: '苏州→青岛库存紧急调拨', impact: '可用马达库存630套', urgency: '24h内', urgencyColor: '#E53935' },
    { title: '通知IKEA启动预案沟通', impact: '避免客户关系损失', urgency: '今日', urgencyColor: '#F57C00' },
  ]},
  B: { items: [
    { title: '青岛产线加班，提前2周备货', impact: '增产8,000件应急', urgency: '48h排产', urgencyColor: '#E53935' },
    { title: '泰国工厂分担5,000件', impact: '11月1日可达港', urgency: '今日确认', urgencyColor: '#F57C00' },
    { title: '确认IKEA最终提前数量', impact: '精准备货，减少浪费', urgency: '今日回复', urgencyColor: '#F57C00' },
  ]},
  C: { items: [
    { title: '✅ 泰国转产方案已最优', impact: '缺口收窄至0.6万件', urgency: '执行中', urgencyColor: '#00897B' },
    { title: '维持当前应急采购计划', impact: '成本增加¥23万', urgency: '已安排', urgencyColor: '#00897B' },
    { title: '更新IKEA交付承诺', impact: '98%可按时交付', urgency: '本周确认', urgencyColor: '#7A8BA8' },
  ]},
};

const SupplyChart = ({ scenario }) => {
  const { inventory, planned, demand } = getScenarioData(scenario);
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4', fontFamily: 'IBM Plex Sans' } },
    legend: { data: ['在手库存', '计划生产', '客户需求', '安全库存'], textStyle: { color: '#7A8BA8' }, top: 0 },
    grid: { top: 35, right: 20, bottom: 35, left: 55, containLabel: true },
    xAxis: { type: 'category', data: WEEK_LABELS, axisLabel: { color: '#7A8BA8', fontSize: 11 }, axisLine: { lineStyle: { color: '#1E2D45' } }, splitLine: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8', fontSize: 11 }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } }, axisLine: { show: false } },
    series: [
      { name: '在手库存', type: 'bar', stack: 'supply', data: inventory, itemStyle: { color: CHART_COLORS.supply[0] }, emphasis: { focus: 'series' } },
      { name: '计划生产', type: 'bar', stack: 'supply', data: planned, itemStyle: { color: CHART_COLORS.supply[2] }, emphasis: { focus: 'series' } },
      { name: '客户需求', type: 'line', data: demand, smooth: true, lineStyle: { color: CHART_COLORS.demand, width: 2.5 }, itemStyle: { color: CHART_COLORS.demand }, z: 10 },
      { name: '安全库存', type: 'line', data: SAFETY_STOCK_LINE, lineStyle: { color: '#F57C00', type: 'dashed', width: 1.5 }, itemStyle: { color: '#F57C00' }, symbol: 'none' },
    ],
  };
  return <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />;
};

const SupplyBalance = () => {
  const [scenario, setScenario] = useState('base');
  const [generating, setGenerating] = useState(false);
  const { gapMsg, gapColor } = getScenarioData(scenario);
  const aiItems = AIPanelContent[scenario]?.items ?? AIPanelContent.base.items;
  
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>供需平衡工作台</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>HJ-LA23 线性推杆 · 周视图 · 第40-55周</p>
        </div>
        <div className="flex gap-2">
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => setScenario(s.id)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{ background: scenario === s.id ? s.color : 'rgba(30,45,69,0.5)', color: scenario === s.id ? '#fff' : '#7A8BA8', border: `1px solid ${scenario === s.id ? s.color : '#1E2D45'}` }} >
              <Play className="w-3 h-3 inline mr-1" />{s.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4 px-4 py-2.5 rounded flex items-center gap-2"
        style={{ background: `${gapColor}12`, border: `1px solid ${gapColor}40` }}>
        <span className="text-sm font-medium" style={{ color: gapColor }}>📊 当前场景分析：</span>
        <span className="text-sm" style={{ color: '#E8EDF4' }}>{gapMsg}</span>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
        <div>
          <div className="card p-4 mb-4"><SupplyChart scenario={scenario} /></div>
          <div className="card overflow-hidden">
            <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: '#1E2D45' }}>
              <span className="text-xs" style={{ color: '#7A8BA8' }}>关键周次明细（W42-W49）</span>
              <span className="text-xs" style={{ color: '#445568' }}>单位：件</span>
            </div>
            <table className="w-full text-xs tabular-nums">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E2D45' }}>
                  {['周次', '在手库存', '计划生产', '客户需求', '净缺口', '状态'].map(h => (
                    <th key={h} className="px-3 py-2 text-right first:text-left" style={{ color: '#7A8BA8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { w: 'W42', inv: 1440, prod: 3600, demand: 8600, gap: -3560, status: '⚠️ 预警' },
                  { w: 'W43', inv: 0, prod: 3600, demand: 9200, gap: -5600, status: '🔴 缺货' },
                  { w: 'W44', inv: 0, prod: 0, demand: 11400,gap: -11400,status: '🔴 断供' },
                  { w: 'W45', inv: 0, prod: 0, demand: 13800,gap: -13800,status: '🔴 断供' },
                  { w: 'W46', inv: 0, prod: 0, demand: 12100,gap: -12100,status: '🔴 断供' },
                  { w: 'W47', inv: 0, prod: 3600, demand: 9800, gap: -6200, status: '🔴 缺货' },
                  { w: 'W48', inv: 3600, prod: 3600, demand: 7200, gap: 0, status: '🟡 恢复' },
                  { w: 'W49', inv: 7200, prod: 3600, demand: 4300, gap: 6500, status: '🟢 正常' },
                ].map(row => (
                  <tr key={row.w} className="border-b hover:bg-opacity-50"
                    style={{ borderColor: '#1E2D45', background: row.gap < -5000 ? 'rgba(229,57,53,0.04)' : 'transparent' }}>
                    <td className="px-3 py-2" style={{ color: '#E8EDF4' }}>{row.w}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#2D7DD2' }}>{row.inv.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#64B5F6' }}>{row.prod.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#E53935' }}>{row.demand.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-bold" style={{ color: row.gap < 0 ? '#E53935' : '#00897B' }}>
                      {row.gap < 0 ? row.gap.toLocaleString() : '+' + row.gap.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#3D9BE9' }}>
              <Zap className="w-4 h-4" /> AI建议方案 <span className="text-xs ml-auto" style={{ color: '#445568' }}>实时计算</span>
            </h3>
            <div className="space-y-2">
              {aiItems.map((item, i) => (
                <div key={i} className="p-3 rounded" style={{ background: '#0B0F17', border: '1px solid #1E2D45' }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium" style={{ color: '#E8EDF4' }}>{item.title}</span>
                    <span className="text-xs ml-2 shrink-0" style={{ color: item.urgencyColor }}>{item.urgency}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={handleGenerate} disabled={generating}
            className="w-full py-3 rounded font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: generating ? 'rgba(45,125,210,0.3)' : '#2D7DD2', color: '#fff', border: 'none', cursor: generating ? 'wait' : 'pointer' }} >
            {generating ? (
              <><span className="inline-block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> AI正在生成采购方案…</>
            ) : (
              <><Zap className="w-4 h-4" /> 一键生成采购申请 <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
          
          <div className="card p-3">
            <p className="text-xs mb-2" style={{ color: '#7A8BA8' }}>方案预算影响</p>
            <div className="space-y-1.5">
              {[
                { label: '紧急采购成本', value: '¥115.3万', color: '#E53935' },
                { label: '可保障收入', value: '¥2,180万', color: '#00897B' },
                { label: 'ROI', value: '18.9x', color: '#3D9BE9' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span style={{ color: '#7A8BA8' }}>{item.label}</span>
                  <span className="font-display font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyBalance;
