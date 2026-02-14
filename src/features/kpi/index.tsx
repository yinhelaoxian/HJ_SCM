import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, DollarSign, Package, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { SCOR_KPI } from '../../services/mock/mock.data';

const KPIDashboard = () => {
  const [activeTab, setActiveTab] = useState('reliability');
  
  const fourQuadrantData = {
    reliability: { current: SCOR_KPI.reliability.pof.current, target: SCOR_KPI.reliability.pof.target },
    responsiveness: { current: SCOR_KPI.responsiveness.otcCycle.current, target: SCOR_KPI.responsiveness.otcCycle.target },
    cost: { current: SCOR_KPI.cost.totalCostPct.current, target: SCOR_KPI.cost.totalCostPct.target },
    asset: { current: SCOR_KPI.asset.c2c.current, target: SCOR_KPI.asset.c2c.target }
  };
  
  const pofTrend = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: ['5月','6月','7月','8月','9月','10月'], axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', min: 50, max: 100, axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: 'POF', type: 'line', data: SCOR_KPI.reliability.pof.trend, smooth: true, lineStyle: { color: '#E53935', width: 2 }, itemStyle: { color: '#E53935' } },
      { name: '目标', type: 'line', data: Array(6).fill(95), lineStyle: { color: '#00897B', type: 'dashed' }, itemStyle: { color: '#00897B' } }
    ]
  };
  
  const costBreakdown = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '55%'],
      data: SCOR_KPI.cost.breakdown.map(b => ({ value: b.pct, name: b.item })),
      itemStyle: { borderRadius: 4 },
      label: { color: '#7A8BA8', formatter: '{b}: {d}%' }
    }]
  };
  
  const otcBreakdown = SCOR_KPI.responsiveness.breakdown.map(b => ({
    name: b.stage,
    value: b.days,
    itemStyle: { color: b.isBottleneck ? '#E53935' : b.days > 10 ? '#F57C00' : '#2D7DD2' }
  }));
  
  const otcWaterfall = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: SCOR_KPI.responsiveness.breakdown.map(b => b.stage), axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [{ type: 'bar', data: otcBreakdown, label: { show: true, position: 'top', color: '#7A8BA8', formatter: '{c}天' } }]
  };
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <Activity className="w-6 h-6" style={{ color: '#2D7DD2' }} />
            SCOR绩效看板
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>供应链运营效果与效率 · 对标行业最佳实践</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: 'rgba(0,137,123,0.08)' }}>
          <Target className="w-4 h-4" style={{ color: '#00897B' }} />
          <span className="text-sm" style={{ color: '#00897B' }}>数据更新: 2026年10月8日</span>
        </div>
      </div>
      
      {/* 四象限总览 */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: '完美订单率 POF', ...fourQuadrantData.reliability, icon: CheckCircle, color: '#E53935', 
            desc: '可靠性维度', status: '🔴 差距大' },
          { label: '订单周期 OTC', ...fourQuadrantData.responsiveness, icon: Clock, color: '#E53935',
            desc: '响应性维度', status: '🔴 需改进' },
          { label: 'SCM成本占比', ...fourQuadrantData.cost, icon: DollarSign, color: '#F57C00',
            desc: '成本维度', status: '🟡 预警' },
          { label: '现金周期 C2C', ...fourQuadrantData.asset, icon: Package, color: '#F57C00',
            desc: '资产维度', status: '🟡 需优化' }
        ].map((kpi, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              <span className="text-xs" style={{ color: '#7A8BA8' }}>{kpi.desc}</span>
            </div>
            <div className="text-2xl font-display mb-1" style={{ color: '#E8EDF4' }}>
              {kpi.current}{kpi.label.includes('周期') || kpi.label.includes('成本') || kpi.label.includes('C2C') ? '' : '%'}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#445568' }}>目标: {kpi.target}{kpi.label.includes('周期') || kpi.label.includes('成本') || kpi.label.includes('C2C') ? '' : '%'}</span>
              <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: kpi.color + '20', color: kpi.color }}>{kpi.status}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 详情Tab */}
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {['reliability', 'responsiveness', 'cost', 'asset'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm ${
                activeTab === tab ? 'bg-accent text-white' : 'border border-border text-secondary'
              }`}>
              {tab === 'reliability' ? '📊 可靠性' : tab === 'responsiveness' ? '⏱️ 响应性' : tab === 'cost' ? '💰 成本' : '📦 资产'}
            </button>
          ))}
        </div>
        
        {activeTab === 'reliability' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>完美订单率趋势</h3>
              <ReactECharts option={pofTrend} style={{ height: 220 }} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>POF拆解分析</h3>
              <div className="space-y-3">
                {[
                  { label: '准时交付率', val: SCOR_KPI.reliability.breakdown.onTime, color: '#E53935' },
                  { label: '质量合格率', val: SCOR_KPI.reliability.breakdown.quality, color: '#00897B' },
                  { label: '单据准确率', val: SCOR_KPI.reliability.breakdown.documentation, color: '#2D7DD2' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#E8EDF4' }}>{item.label}</span>
                      <span style={{ color: item.color }}>{item.val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-base">
                      <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded" style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid #E53935' }}>
                <p className="text-xs font-medium" style={{ color: '#E53935' }}>IKEA专项分析</p>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                  IKEA的POF仅为71%，主要受延期交付影响（准时率68%）。建议优先解决Bühler断供问题。
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'responsiveness' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>OTC周期瀑布图</h3>
              <ReactECharts option={otcWaterfall} style={{ height: 220 }} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>各环节对比</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E2D45' }}>
                    <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>环节</th>
                    <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>实际</th>
                    <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>标杆</th>
                    <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>差距</th>
                  </tr>
                </thead>
                <tbody>
                  {SCOR_KPI.responsiveness.breakdown.map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: '#1E2D45' }}>
                      <td className="py-2" style={{ color: '#E8EDF4' }}>
                        {row.stage}
                        {row.isBottleneck && <span className="ml-1 text-xs" style={{ color: '#E53935' }}>🔴瓶颈</span>}
                      </td>
                      <td className="py-2 text-right" style={{ color: '#E8EDF4' }}>{row.days}天</td>
                      <td className="py-2 text-right" style={{ color: '#7A8BA8' }}>{row.benchmark}天</td>
                      <td className="py-2 text-right" style={{ color: row.days > row.benchmark ? '#E53935' : '#00897B' }}>
                        +{row.days - row.benchmark}天
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-3 rounded" style={{ background: 'rgba(245,124,0,0.06)', border: '1px solid #F57C00' }}>
                <p className="text-xs font-medium" style={{ color: '#F57C00' }}>💡 改进建议</p>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                  订单排产环节耗时7天（标杆3天），是最大瓶颈。建议引入APS高级排程系统。
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cost' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>供应链成本结构</h3>
              <ReactECharts option={costBreakdown} style={{ height: 220 }} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>成本节约机会</h3>
              <div className="p-4 rounded mb-3" style={{ background: 'rgba(0,137,123,0.08)', border: '1px solid #00897B' }}>
                <div className="text-2xl font-display" style={{ color: '#00897B' }}>¥{SCOR_KPI.cost.savingOpportunity}万/年</div>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>AI识别的成本优化潜力</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded" style={{ background: '#0B0F17' }}>
                  <span style={{ color: '#E8EDF4' }}>库存优化</span>
                  <span className="text-xs" style={{ color: '#00897B' }}>-¥180万</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded" style={{ background: '#0B0F17' }}>
                  <span style={{ color: '#E8EDF4' }}>采购谈判</span>
                  <span className="text-xs" style={{ color: '#00897B' }}>-¥95万</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded" style={{ background: '#0B0F17' }}>
                  <span style={{ color: '#E8EDF4' }}>物流整合</span>
                  <span className="text-xs" style={{ color: '#00897B' }}>-¥65万</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'asset' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>现金周期分解</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'DSI 库存天数', val: SCOR_KPI.asset.dsi.current, target: SCOR_KPI.asset.dsi.target, color: '#E53935' },
                  { label: 'DSO 应收天数', val: SCOR_KPI.asset.dso.current, target: SCOR_KPI.asset.dso.target, color: '#F57C00' },
                  { label: 'DPO 应付天数', val: SCOR_KPI.asset.dpo.current, target: SCOR_KPI.asset.dpo.target, color: '#00897B' },
                  { label: 'C2C 现金周期', val: SCOR_KPI.asset.c2c.current, target: SCOR_KPI.asset.c2c.target, color: '#E53935' }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded" style={{ background: '#0B0F17' }}>
                    <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>{item.label}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-display" style={{ color: item.color }}>{item.val}</span>
                      <span className="text-xs mb-1" style={{ color: '#445568' }}>天</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#445568' }}>目标: {item.target}天</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>库存周转趋势</h3>
              <div className="p-4 rounded mb-3" style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid #E53935' }}>
                <p className="text-xs mb-1" style={{ color: '#E53935' }}>⚠️ 呆滞库存警示</p>
                <div className="text-xl font-display" style={{ color: '#E53935' }}>¥{SCOR_KPI.asset.slowMovingValue}万</div>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>超过180天未周转的库存</p>
              </div>
              <ReactECharts option={{
                xAxis: { type: 'category', data: ['Q1','Q2','Q3','Q4'], axisLabel: { color: '#7A8BA8' } },
                yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' } },
                series: [{ type: 'bar', data: [10.2, 9.8, 9.5, 9.1], itemStyle: { color: '#E53935' } }]
              }} style={{ height: 120 }} />
            </div>
          </div>
        )}
      </div>
      
      {/* AI改善路线图 */}
      <div className="card p-4 mt-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
          <AlertTriangle className="w-4 h-4" style={{ color: '#F57C00' }} />
          AI改善优先级路线图
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #1E2D45' }}>
              <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>优先级</th>
              <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>改善项目</th>
              <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>预期影响</th>
              <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>所需时间</th>
              <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>关联模块</th>
            </tr>
          </thead>
          <tbody>
            {SCOR_KPI.improvements.map((imp, i) => (
              <tr key={i} className="border-b" style={{ borderColor: '#1E2D45' }}>
                <td className="py-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold" 
                    style={{ background: imp.priority === 'P1' ? '#E53935' : imp.priority === 'P2' ? '#F57C00' : '#00897B', color: '#fff' }}>
                    {imp.priority}
                  </span>
                </td>
                <td className="py-2" style={{ color: '#E8EDF4' }}>{imp.title}</td>
                <td className="py-2" style={{ color: '#00897B' }}>{imp.impact}</td>
                <td className="py-2" style={{ color: '#7A8BA8' }}>{imp.timeline}</td>
                <td className="py-2">
                  <span className="px-2 py-0.5 rounded text-xs" 
                    style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
                    {imp.module}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIDashboard;
