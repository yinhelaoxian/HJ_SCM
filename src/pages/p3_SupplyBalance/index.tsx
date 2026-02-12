// Page 3: 供需平衡工作台
import React, { useState } from 'react';
import {
  Factory, Truck, Package, ArrowRight,
  Zap, RefreshCw, Play
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { MATERIALS, SUPPLIERS } from '../../data/mock.data';
import { CHART_COLORS } from '../../config/demo.config';

const SCENARIOS = [
  { id: 'A', label: 'Bühler断供6周', desc: '缺口扩大至4.1万件' },
  { id: 'B', label: 'IKEA提前3周发货', desc: '第40周出现新缺口' },
  { id: 'C', label: '泰国工厂转产支援', desc: '缺口收窄至0.6万件' }
];

const SupplyChart: React.FC<{ scenario: string }> = ({ scenario }) => {
  const weekLabels = Array.from({length: 16}, (_, i) => `W${40+i}`);
  
  const baseData = [3600, 3600, 3600, 3600, 3600, 3600, 0, 0, 0, 3600, 3600, 3600, 3600, 3600, 3600, 3600];
  
  const adjustedData = scenario === 'C' 
    ? baseData.map(v => v + 800)
    : scenario === 'A' 
      ? baseData.map((v, i) => i >= 5 && i <= 7 ? 0 : v * 0.6)
      : baseData;
  
  const demandData = [2800, 3100, 3400, 8600, 9200, 11400, 13800, 12100, 9800, 7200, 4300, 2100, 1800, 1400, 1200, 1000];
  
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['在手库存', '计划生产', '客户需求'], textStyle: { color: '#7A8BA8' } },
    grid: { top: 30, right: 100, bottom: 30, left: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: weekLabels,
      axisLabel: { color: '#7A8BA8' },
      axisLine: { lineStyle: { color: '#1E2D45' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#7A8BA8' },
      splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } }
    },
    series: [
      {
        name: '在手库存',
        type: 'bar',
        stack: 'supply',
        data: adjustedData.slice(0, 12),
        itemStyle: { color: CHART_COLORS.supply[0] }
      },
      {
        name: '计划生产',
        type: 'bar',
        stack: 'supply',
        data: adjustedData.slice(6, 12),
        itemStyle: { color: CHART_COLORS.supply[2] }
      },
      {
        name: '客户需求',
        type: 'line',
        data: demandData.slice(0, 12),
        lineStyle: { color: CHART_COLORS.demand, width: 2 },
        itemStyle: { color: CHART_COLORS.demand },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(229, 57, 53, 0.3)' },
              { offset: 1, color: 'rgba(229, 57, 53, 0)' }
            ]
          }
        }
      },
      {
        name: '安全库存',
        type: 'line',
        data: Array(12).fill(8000),
        lineStyle: { color: '#F57C00', type: 'dashed' },
        itemStyle: { color: '#F57C00' }
      }
    ]
  };
  
  return <ReactECharts option={option} style={{ height: 280 }} />;
};

const ScenarioPanel: React.FC<{ onSelect: (s: string) => void }> = ({ onSelect }) => (
  <div className="card p-4">
    <h3 className="text-sm font-medium text-secondary mb-3">What-if模拟场景</h3>
    <div className="space-y-2">
      {SCENARIOS.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="w-full p-3 border border-border rounded hover:bg-card-hover flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-accent" />
            <div className="text-left">
              <p className="text-sm text-primary group-hover:text-accent">{s.label}</p>
              <p className="text-xs text-muted">{s.desc}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted" />
        </button>
      ))}
    </div>
  </div>
);

const AISuggestion: React.FC = () => (
  <div className="card p-4 sticky top-4">
    <h3 className="text-sm font-medium text-accent mb-3 flex items-center">
      <Zap className="w-4 h-4 mr-2" />
      AI建议方案
    </h3>
    
    <div className="space-y-3">
      {[
        { title: '泰国工厂转产', impact: '+4,800件/月', urgency: '48h内' },
        { title: '启动国内替代认证', impact: '14天完成', urgency: '72h内' },
        { title: '追加Bühler确认', impact: '争取分批', urgency: '本周内' }
      ].map((item, i) => (
        <div key={i} className="p-3 bg-card rounded border border-border">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-primary">{item.title}</span>
            <span className="text-xs text-warning">{item.urgency}</span>
          </div>
          <p className="text-xs text-secondary">{item.impact}</p>
        </div>
      ))}
    </div>
    
    <button className="w-full mt-4 py-2 bg-accent text-white rounded text-sm font-medium">
      一键生成采购申请
    </button>
  </div>
);

const SupplyBalance: React.FC = () => {
  const [scenario, setScenario] = useState('C');
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary">供需平衡工作台</h1>
          <p className="text-sm text-secondary">HJ-LA23 线性推杆 · 周视图</p>
        </div>
        <div className="flex gap-2">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`px-4 py-2 rounded text-sm ${
                scenario === s.id 
                  ? 'bg-accent text-white' 
                  : 'border border-border text-secondary hover:bg-card-hover'
              }`}
            >
              {s.id}. {s.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="card p-4 mb-4">
            <h2 className="text-lg font-medium text-primary mb-2 flex items-center">
              <Factory className="w-5 h-5 mr-2 text-accent" />
              供需态势（未来16周）
            </h2>
            <SupplyChart scenario={scenario} />
          </div>
          
          <div className="card overflow-hidden">
            <div className="p-3 border-b border-border flex justify-between">
              <span className="text-sm text-secondary">物料明细</span>
              <span className="text-xs text-muted">单位：件</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary">
                  <th className="p-2 text-left">周次</th>
                  <th className="p-2 text-right">在手</th>
                  <th className="p-2 text-right">在途</th>
                  <th className="p-2 text-right">计划</th>
                  <th className="p-2 text-right">需求</th>
                  <th className="p-2 text-right">缺口</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length: 8}).map((_, i) => (
                  <tr key={i} className="border-b border-border hover:bg-card-hover">
                    <td className="p-2 text-primary">W{44+i}</td>
                    <td className="p-2 text-right text-accent">{3600}</td>
                    <td className="p-2 text-right text-blue-light">{i < 2 ? 0 : 0}</td>
                    <td className="p-2 text-right text-success">{i < 3 ? 3600 : 0}</td>
                    <td className="p-2 text-right text-danger">{[8600, 9200, 11400, 13800][i] || 0}</td>
                    <td className="p-2 text-right">
                      <span className="text-danger font-bold">
                        {[5000, 5600, 7800, 10200][i] || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="col-span-4">
          <ScenarioPanel onSelect={setScenario} />
          <AISuggestion />
        </div>
      </div>
    </div>
  );
};

export default SupplyBalance;
