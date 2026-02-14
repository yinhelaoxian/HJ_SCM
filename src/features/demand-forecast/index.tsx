import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { MATERIALS, KPI_DATA } from '../../services/mock/mock.data';
import { CHART_COLORS, ECHARTS_THEME } from '../../core/config/demo.config';
import { TYPEWRITER_TEXTS } from '../../services/mock/ai.suggestions';

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

const DemandForecast: React.FC = () => {
  const material = MATERIALS[0];
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary">AI需求预测工作台</h1>
          <p className="text-sm text-secondary">HJ-LA23 线性推杆 · 35mm行程</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded border border-border text-sm text-secondary hover:bg-card">周视图</button>
          <button className="px-4 py-2 rounded bg-accent text-white text-sm">AI预测版本</button>
        </div>
      </div>
      
      <div className="card p-4 mb-4">
        <h2 className="text-lg font-medium text-primary mb-2 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-accent-blue" />
          需求预测对比（未来12周）
        </h2>
        <ReactECharts option={{
          ...ECHARTS_THEME,
          xAxis: { type: 'category', data: ['W40','W41','W42','W43','W44','W45','W46','W47','W48','W49','W50','W51'] },
          yAxis: { type: 'value' },
          series: [
            { name: 'AI预测', type: 'line', data: material.demandForecastAI?.slice(0,12) },
            { name: '人工预测', type: 'line', data: material.demandForecastPlanner?.slice(0,12) }
          ]
        }} style={{ height: 280 }} />
        
        <div className="mt-4 p-3 border border-warning rounded bg-card-hover">
          <h3 className="text-sm font-medium text-accent mb-2">AI分析逻辑</h3>
          <p className="text-sm text-secondary leading-relaxed">{TYPEWRITER_TEXTS.forecast}</p>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast;
