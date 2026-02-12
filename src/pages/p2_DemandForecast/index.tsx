// Page 2: AI需求预测工作台
import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Calendar, AlertTriangle,
  BarChart3, ArrowRight
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { MATERIALS, KPI_DATA } from '../../data/mock.data';
import { CHART_COLORS, ECHARTS_THEME } from '../../config/demo.config';
import { TYPEWRITER_TEXTS } from '../../data/ai.suggestions';

const Typewriter: React.FC<{ text: string; speed?: number }> = ({ text, speed = 18 }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i++));
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return <span>{displayed}<span className="cursor-blink">|</span></span>;
};

const DemandChart: React.FC<{ material: typeof MATERIALS[0] }> = ({ material }) => {
  const weeks = Array.from({length: 12}, (_, i) => `W${40+i}`);
  
  const option = {
    ...ECHARTS_THEME,
    tooltip: { 
      trigger: 'axis',
      backgroundColor: '#1A2235',
      borderColor: '#2D7DD2'
    },
    legend: {
      data: ['历史实际', 'AI预测', '计划员预测'],
      textStyle: { color: '#7A8BA8' }
    },
    grid: { top: 30, right: 20, bottom: 30, left: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: weeks,
      axisLine: { lineStyle: { color: '#1E2D45' } },
      axisLabel: { color: '#7A8BA8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#7A8BA8' },
      splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } }
    },
    series: [
      {
        name: '历史实际',
        type: 'line',
        data: material.weeklyDemand?.slice(0, 12),
        smooth: true,
        lineStyle: { color: '#E8EDF4', width: 2 },
        itemStyle: { color: '#E8EDF4' }
      },
      {
        name: 'AI预测',
        type: 'line',
        data: material.demandForecastAI?.slice(0, 12),
        smooth: true,
        lineStyle: { color: '#2D7DD2', width: 2, type: 'dashed' },
        itemStyle: { color: '#2D7FF2' }
      },
      {
        name: '计划员预测',
        type: 'line', 
        data: material.demandForecastPlanner?.slice(0, 12),
        smooth: true,
        lineStyle: { color: '#F57C00', width: 2, type: 'dashed' },
        itemStyle: { color: '#F57C00' }
      },
      {
        type: 'line',
        markArea: {
          itemStyle: { color: 'rgba(229, 57, 53, 0.15)' },
          data: [[{ xAxis: 'W44' }, { xAxis: 'W46' }]
        }
      }
    ]
  };
  
  return <ReactECharts option={option} style={{ height: 280 }} />;
};

const AccuracyTrend: React.FC = () => {
  const data = [72, 68, 75, 62, 58, 61];
  const option = {
    ...ECHARTS_THEME,
    grid: { top: 20, right: 20, bottom: 20, left: 50 },
    xAxis: { 
      type: 'category', 
      data: ['5月', '6月', '7月', '8月', '9月', '10月'],
      axisLine: { lineStyle: { color: '#1E2D45' } },
      axisLabel: { color: '#7A8BA8' }
    },
    yAxis: { 
      type: 'value', 
      min: 50, max: 100,
      axisLabel: { color: '#7A8BA8' },
      splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: data,
      itemStyle: { color: '#2D7DD2' }
    }]
  };
  
  return <ReactECharts option={option} style={{ height: 150 }} />;
};

const DemandForecast: React.FC = () => {
  const material = MATERIALS[0];
  
  return (
    <div className="page-enter">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary">AI需求预测工作台</h1>
          <p className="text-sm text-secondary">HJ-LA23 线性推杆 · 35mm行程</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded border border-border text-sm text-secondary hover:bg-card-hover">
            周视图
          </button>
          <button className="px-4 py-2 rounded bg-accent text-white text-sm">
            AI预测版本
          </button>
        </div>
      </div>
      
      {/* 主图表区 */}
      <div className="card p-4 mb-4">
        <h2 className="text-lg font-medium text-primary mb-2 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-accent-blue" />
          需求预测对比（未来12周）
        </h2>
        <DemandChart material={material} />
        
        {/* AI解读面板 */}
        <div className="mt-4 p-4 border border-border rounded bg-card-hover">
          <h3 className="text-sm font-medium text-accent-blue mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            AI预测逻辑解析
          </h3>
          <p className="text-sm text-secondary leading-relaxed">
            <Typewriter text={TYPEWRITER_TEXTS.forecast} />
          </p>
        </div>
        
        {/* 准确率追踪 */}
        <div className="mt-4 flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-secondary">置信度</span>
              <span className="text-xl font-display text-accent-blue">84%</span>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm text-secondary block mb-2">历史准确率追踪</span>
            <AccuracyTrend />
          </div>
        </div>
      </div>
      
      {/* 差异对比表 */}
      <div className="card overflow-hidden">
        <div className="p-3 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-medium text-primary">预测差异分析</h3>
          <span className="text-xs text-muted">数据来源：历史销售 + 市场信号 + 竞品情报</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-secondary">
              <th className="p-2 text-left">周次</th>
              <th className="p-2 text-right">AI预测</th>
              <th className="p-2 text-right">计划员预测</th>
              <th className="p-2 text-right">差异</th>
              <th className="p-2 text-center">风险</th>
            </tr>
          </thead>
          <tbody>
            {['W44', 'W45', 'W46', 'W47'].map((week, i) => {
              const ai = material.demandForecastAI?.[i] || 0;
              const planner = material.demandForecastPlanner?.[i] || 0;
              const diff = Math.round((ai - planner) / planner * 100);
              const isHighRisk = diff > 50;
              const isWarning = diff > 30;
              
              return (
                <tr key={week} className="border-b border-border">
                  <td className="p-2 text-primary">{week}</td>
                  <td className="p-2 text-right text-accent-blue font-display">{ai?.toLocaleString()}</td>
                  <td className="p-2 text-right text-warning font-display">{planner.toLocaleString()}</td>
                  <td className={`p-2 text-right font-display ${diff > 0 ? 'text-danger' : 'text-success'}`}>
                    {diff > 0 ? '+' : ''}{diff}%
                  </td>
                  <td className="p-2 text-center">
                    {isHighRisk ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-danger-bg border border-danger text-danger">高风险</span>
                    ) : isWarning ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-warning-bg border border-warning text-warning">关注</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-success-bg border border-success text-success">正常</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandForecast;
