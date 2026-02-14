import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { SOP_DATA, MPS_DATA } from '../../services/mock/mock.data';

const SOP = () => {
  const [activeTab, setActiveTab] = useState('demand');
  
  const monthChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    legend: { data: ['需求', '产能', '缺口'], textStyle: { color: '#7A8BA8' }, top: 0 },
    grid: { top: 35, right: 20, bottom: 30, left: 55 },
    xAxis: { type: 'category', data: SOP_DATA.monthlyData.map(m => m.month), axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '需求', type: 'bar', data: SOP_DATA.monthlyData.map(m => m.demand), itemStyle: { color: '#2D7DD2' } },
      { name: '产能', type: 'bar', data: SOP_DATA.monthlyData.map(m => m.capacity), itemStyle: { color: '#00897B' } },
      { name: '缺口', type: 'line', data: SOP_DATA.monthlyData.map(m => m.gap), yAxisIndex: 1, lineStyle: { color: '#E53935' }, itemStyle: { color: '#E53935' } }
    ]
  };
  
  const balanceChart = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '60%'],
      data: [
        { value: 68, name: '采购成本', itemStyle: { color: '#2D7DD2' } },
        { value: 12, name: '仓储成本', itemStyle: { color: '#00897B' } },
        { value: 15, name: '物流成本', itemStyle: { color: '#F57C00' } },
        { value: 5, name: '运营成本', itemStyle: { color: '#7A8BA8' } }
      ],
      label: { color: '#7A8BA8' }
    }]
  };
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>S&OP 产销协同工作台</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>2026年10月 · 战略层月度计划</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded text-sm" style={{ border: '1px solid #1E2D45', color: '#7A8BA8' }}>
            生成会议议程
          </button>
          <button className="px-4 py-2 rounded text-sm" style={{ background: '#2D7DD2', color: '#fff' }}>
            发起审批流程
          </button>
        </div>
      </div>
      
      {/* S&OP进度条 */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between">
          {SOP_DATA.steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step.status === 'completed' ? 'bg-success text-white' :
                  step.status === 'in_progress' ? 'bg-accent text-white' :
                  'bg-base border border-border text-muted'
                }`}>
                  {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : 
                   step.status === 'in_progress' ? <Clock className="w-4 h-4" /> : step.id}
                </div>
                <span className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{step.label}</span>
                <span className="text-xs" style={{ color: '#445568' }}>{step.date}</span>
              </div>
              {i < SOP_DATA.steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2" style={{ 
                  background: i < 2 ? 'linear-gradient(90deg, #00897B, #00897B)' : '#1E2D45' 
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '35% 65%' }}>
        {/* 左侧：供需平衡表 */}
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>供需平衡总览</h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2D45' }}>
                <th className="py-2 text-left" style={{ color: '#7A8BA8' }}>产品线</th>
                <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>需求</th>
                <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>产能</th>
                <th className="py-2 text-right" style={{ color: '#7A8BA8' }}>缺口</th>
              </tr>
            </thead>
            <tbody>
              {SOP_DATA.demandByProduct.map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#1E2D45' }}>
                  <td className="py-2" style={{ color: '#E8EDF4' }}>{row.product}</td>
                  <td className="py-2 text-right">{row.demand.toLocaleString()}</td>
                  <td className="py-2 text-right">{row.capacity.toLocaleString()}</td>
                  <td className="py-2 text-right" style={{ 
                    color: row.status === 'critical' ? '#E53935' : row.status === 'surplus' ? '#00897B' : '#7A8BA8' 
                  }}>
                    {row.gap > 0 ? '+' : ''}{row.gap.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#1E2D45' }}>
            <h4 className="text-xs mb-2" style={{ color: '#7A8BA8' }}>三大平衡状态</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded" 
                style={{ background: SOP_DATA.threeBalances.supplyDemand === 'critical' ? 'rgba(229,57,53,0.08)' : 'rgba(0,137,123,0.08)' }}>
                <span className="text-sm" style={{ color: '#E8EDF4' }}>供需平衡</span>
                <span className="text-xs px-2 py-0.5 rounded" 
                  style={{ 
                    background: SOP_DATA.threeBalances.supplyDemand === 'critical' ? '#E53935' : '#00897B',
                    color: '#fff' 
                  }}>
                  {SOP_DATA.threeBalances.supplyDemand === 'critical' ? '🔴 不平衡' : '🟢 平衡' }
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" 
                style={{ background: 'rgba(245,124,0,0.08)' }}>
                <span className="text-sm" style={{ color: '#E8EDF4' }}>财务平衡</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#F57C00', color: '#fff' }}>🟡 预警</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" 
                style={{ background: 'rgba(245,124,0,0.08)' }}>
                <span className="text-sm" style={{ color: '#E8EDF4' }}>全局平衡</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#F57C00', color: '#fff' }}>🟡 预警</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：Tab切换 */}
        <div className="card p-4">
          <div className="flex gap-2 mb-4">
            {['demand', 'supply', 'financial'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded text-sm ${
                  activeTab === tab ? 'bg-accent text-white' : 'border border-border text-secondary'
                }`}>
                {tab === 'demand' ? '📊 需求侧' : tab === 'supply' ? '🏭 供应侧' : '💰 财务平衡'}
              </button>
            ))}
          </div>
          
          {activeTab === 'demand' && (
            <div>
              <ReactECharts option={monthChart} style={{ height: 280 }} />
              <div className="mt-4 p-3 rounded" style={{ background: 'rgba(245,124,0,0.06)', border: '1px solid #F57C00' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#F57C00' }}>⚠️ 待确认事项</p>
                <p className="text-sm" style={{ color: '#7A8BA8' }}>
                  销售部申请将10月HJ-LA23预测上调18%（+5,700件），COO王志远尚未审批
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'supply' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs mb-2" style={{ color: '#7A8BA8' }}>三厂产能热力图</h4>
                  <div className="space-y-2">
                    {[
                      { plant: '青岛总部', pct: 112, color: '#E53935' },
                      { plant: '苏州华东', pct: 78, color: '#F57C00' },
                      { plant: '泰国曼谷', pct: 43, color: '#F57C00' }
                    ].map((p, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: '#E8EDF4' }}>{p.plant}</span>
                          <span style={{ color: p.color }}>{p.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-base">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(p.pct, 100)}%`, background: p.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs mb-2" style={{ color: '#7A8BA8' }}>泰国工厂爬坡预测</h4>
                  <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                    <p className="text-xs mb-2" style={{ color: '#7A8BA8' }}>当前产能: <span style={{ color: '#F57C00' }}>43%</span></p>
                    <p className="text-xs mb-2" style={{ color: '#7A8BA8' }}>目标产能: <span style={{ color: '#00897B' }}>75%</span></p>
                    <p className="text-xs" style={{ color: '#7A8BA8' }}>预计达成: <span style={{ color: '#7A8BA8' }}>2026年Q2</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'financial' && (
            <div>
              <ReactECharts option={balanceChart} style={{ height: 200 }} />
              <div className="mt-4 p-3 rounded" style={{ background: 'rgba(0,137,123,0.08)', border: '1px solid #00897B' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#00897B' }}>💡 财务洞察</p>
                <p className="text-sm" style={{ color: '#7A8BA8' }}>
                  预计10-11月采购资金需求增加¥2,400万，建议提前与银行沟通授信额度
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOP;
