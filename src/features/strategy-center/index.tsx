import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Award, Users, Globe, BarChart3, PieChart } from 'lucide-react';

function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

// 战略KPI大卡片
const StrategicKPICard = ({ title, current, target, unit, trend, benchmark, status = 'warning' }) => {
  const progress = Math.min((current / target) * 100, 100);
  const gap = target - current;
  const statusColor = status === 'danger' ? '#E53935' : status === 'warning' ? '#F57C00' : '#00897B';
  
  return (
    <div className="p-5 rounded-lg border" style={{ background: 'rgba(30,45,69,0.3)', borderColor: '#1E2D45' }}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm" style={{ color: '#7A8BA8' }}>{title}</span>
        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${trend === 'up' ? 'bg-green-900/30 text-green-400' : trend === 'down' ? 'bg-red-900/30 text-red-400' : 'bg-gray-700/30 text-gray-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}同比
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display text-4xl font-bold" style={{ color: '#E8EDF4' }}>{useCountUp(current)}</span>
        <span className="text-lg" style={{ color: '#7A8BA8' }}>{unit}</span>
      </div>
      <div className="mb-3">
        <div className="h-2 rounded-full" style={{ background: '#1E2D45' }}>
          <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: statusColor }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#445568' }}>当前 {current}{unit}</span>
          <span className="text-xs" style={{ color: '#445568' }}>目标 {target}{unit}</span>
        </div>
      </div>
      {benchmark && (
        <div className="pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: '#7A8BA8' }}>行业对标</span>
            <span className="text-xs font-medium" style={{ color: benchmark > current ? '#E53935' : '#00897B' }}>
              {benchmark > current ? '落后' : '领先'}行业平均 {Math.abs(((current - benchmark) / benchmark * 100)).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 趋势图组件
const TrendChart = ({ title, data, labels }) => {
  const maxVal = Math.max(...data);
  return (
    <div className="p-4 rounded-lg border" style={{ background: 'rgba(30,45,69,0.3)', borderColor: '#1E2D45' }}>
      <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>{title}</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t transition-all hover:opacity-80" 
              style={{ height: `${(val / maxVal) * 100}%`, background: i === data.length - 1 ? '#2D7DD2' : '#1E2D45' }} />
            <span className="text-xs" style={{ color: '#445568' }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 雷达图 - 行业对标
const RadarChart = () => {
  const metrics = [
    { name: 'OTD交付', current: 76, target: 94, industry: 85 },
    { name: '库存周转', current: 9.1, target: 15, industry: 12 },
    { name: '计划准确率', current: 61, target: 85, industry: 75 },
    { name: '客户满意度', current: 72, target: 90, industry: 82 },
  ];
  
  return (
    <div className="p-4 rounded-lg border" style={{ background: 'rgba(30,45,69,0.3)', borderColor: '#1E2D45' }}>
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
        <Globe className="w-4 h-4" style={{ color: '#2D7DD2' }} /> 行业对标分析
      </h3>
      <div className="space-y-3">
        {metrics.map((m, i) => {
          const currentPct = (m.current / m.target) * 100;
          const industryPct = (m.industry / m.target) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: '#7A8BA8' }}>{m.name}</span>
                <span className="text-xs" style={{ color: '#445568' }}>当前{m.current} | 目标{m.target} | 行业{m.industry}</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="rounded" style={{ width: `${currentPct}%`, background: currentPct >= 80 ? '#00897B' : currentPct >= 60 ? '#F57C00' : '#E53935' }} />
                <div className="rounded opacity-40" style={{ width: `${industryPct}%`, background: '#7A8BA8' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 战略预警卡片
const StrategicAlert = ({ level, title, impact, recommendation }) => {
  const colors = {
    critical: { bg: 'rgba(229,57,53,0.1)', border: '#E53935', text: '#E53935' },
    warning: { bg: 'rgba(245,124,0,0.1)', border: '#F57C00', text: '#F57C00' },
    info: { bg: 'rgba(45,125,210,0.1)', border: '#2D7DD2', text: '#2D7DD2' },
  };
  const c = colors[level];
  
  return (
    <div className="p-4 rounded-lg border" style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ background: c.text }} />
        <span className="text-sm font-medium" style={{ color: c.text }}>{level === 'critical' ? '🔴 严重' : level === 'warning' ? '🟡 警告' : '🟢 关注'}</span>
      </div>
      <h4 className="text-base font-medium mb-2" style={{ color: '#E8EDF4' }}>{title}</h4>
      <p className="text-xs mb-2" style={{ color: '#7A8BA8' }}>业务影响: {impact}</p>
      <p className="text-xs p-2 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: '#E8EDF4' }}>建议: {recommendation}</p>
    </div>
  );
};

// 财务摘要
const FinancialSummary = () => {
  const data = [
    { label: '供应链成本占比', value: '18.5%', target: '15%', trend: 'up' },
    { label: '毛利率', value: '32.4%', target: '35%', trend: 'down' },
    { label: '库存持有成本', value: '¥1,240万', target: '¥500万', trend: 'up' },
  ];
  
  return (
    <div className="p-4 rounded-lg border" style={{ background: 'rgba(30,45,69,0.3)', borderColor: '#1E2D45' }}>
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
        <BarChart3 className="w-4 h-4" style={{ color: '#2D7DD2' }} /> 财务摘要
      </h3>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i} className="flex justify-between items-center p-2 rounded" style={{ background: '#0B0F17' }}>
            <span className="text-sm" style={{ color: '#7A8BA8' }}>{d.label}</span>
            <div className="text-right">
              <span className="text-sm font-medium" style={{ color: d.trend === 'up' && d.label.includes('成本') ? '#E53935' : '#E8EDF4' }}>{d.value}</span>
              <span className="text-xs ml-2" style={{ color: '#445568' }}>目标{d.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 竞争对手对比
const CompetitorBenchmark = () => {
  const competitors = [
    { name: '豪江智能', otd: 76, inventory: 9.1, satisfaction: 72, score: 65 },
    { name: '行业平均', otd: 85, inventory: 12, satisfaction: 82, score: 78 },
    { name: '头部企业A', otd: 94, inventory: 15, satisfaction: 90, score: 92 },
  ];
  
  return (
    <div className="p-4 rounded-lg border" style={{ background: 'rgba(30,45,69,0.3)', borderColor: '#1E2D45' }}>
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
        <Award className="w-4 h-4" style={{ color: '#F57C00' }} /> 竞争对标
      </h3>
      <div className="space-y-2">
        {competitors.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded" style={{ background: i === 0 ? 'rgba(45,125,210,0.1)' : '#0B0F17' }}>
            <span className="text-sm w-20" style={{ color: i === 0 ? '#2D7DD2' : '#7A8BA8' }}>{c.name}</span>
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
              <span style={{ color: c.otd < 85 ? '#E53935' : '#00897B' }}>OTD {c.otd}%</span>
              <span style={{ color: c.inventory < 10 ? '#E53935' : '#00897B' }}>周转 {c.inventory}</span>
              <span style={{ color: c.satisfaction < 80 ? '#E53935' : '#00897B' }}>满意度 {c.satisfaction}%</span>
            </div>
            <span className="text-sm font-medium" style={{ color: c.score >= 80 ? '#00897B' : c.score >= 60 ? '#F57C00' : '#E53935' }}>{c.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategyCenter = () => {
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>战略数据中心</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>高管决策支持 · 一屏掌控全局</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>2026年Q1</span>
          <span className="text-xs px-3 py-1 rounded" style={{ background: 'rgba(0,137,123,0.1)', color: '#00897B' }}>数据更新: 今日</span>
        </div>
      </div>
      
      {/* 战略KPI第一行 - 核心指标 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StrategicKPICard 
          title="OTD准时交付率" 
          current={76} target={94} unit="%" 
          trend="up" benchmark={85}
          status="danger" 
        />
        <StrategicKPICard 
          title="库存周转率" 
          current={9.1} target={15} unit="次/年" 
          trend="up" benchmark={12}
          status="danger" 
        />
        <StrategicKPICard 
          title="客户满意度(NPS)" 
          current={72} target={90} unit="" 
          trend="up" benchmark={82}
          status="warning" 
        />
        <StrategicKPICard 
          title="计划准确率" 
          current={61} target={85} unit="%" 
          trend="up" benchmark={75}
          status="danger" 
        />
      </div>
      
      {/* 战略KPI第二行 - 财务与成本 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StrategicKPICard 
          title="供应链总成本占比" 
          current={18.5} target={15} unit="%" 
          trend="up" benchmark={16}
          status="warning" 
        />
        <StrategicKPICard 
          title="毛利率" 
          current={32.4} target={35} unit="%" 
          trend="down" benchmark={30}
          status="warning" 
        />
        <StrategicKPICard 
          title="呆滞库存金额" 
          current={1240} target={500} unit="万" 
          trend="up" benchmark={800}
          status="danger" 
        />
        <StrategicKPICard 
          title="紧急插单率" 
          current={35} target={10} unit="%" 
          trend="down" benchmark={15}
          status="danger" 
        />
      </div>
      
      {/* 第三行 - 图表与分析 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
        <TrendChart 
          title="OTD趋势 (近6季度)" 
          data={[68, 70, 72, 74, 75, 76]} 
          labels={['Q2\'25', 'Q3\'25', 'Q4\'25', 'Q1\'26', '本月', '目标']} 
        />
        <RadarChart />
        <FinancialSummary />
      </div>
      
      {/* 第四行 - 竞争对标与预警 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <CompetitorBenchmark />
        <div>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <Target className="w-4 h-4" style={{ color: '#E53935' }} /> 战略预警与建议
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <StrategicAlert 
              level="critical"
              title="库存周转严重落后"
              impact="资金占用高于行业均值45%，影响现金流"
              recommendation="立即启动库存优化专项，优先处理呆滞物料"
            />
            <StrategicAlert 
              level="critical"
              title="计划准确率偏低"
              impact="导致紧急插单率35%，产能利用率波动大"
              recommendation="引入AI预测模型，目标Q2提升至75%"
            />
            <StrategicAlert 
              level="warning"
              title="OTD有改善但仍落后"
              impact="客户投诉风险持续存在"
              recommendation="加强供应商交期管理，锁定瓶颈物料"
            />
            <StrategicAlert 
              level="info"
              title="客户满意度稳步提升"
              impact="NPS较去年提升8分"
              recommendation="保持当前改进势头，关注售后响应速度"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyCenter;
