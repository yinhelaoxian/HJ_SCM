import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, Factory, Activity, Zap, Package, Users, Globe } from 'lucide-react';
import { KPI_DATA, ALERTS, PLANT_STATUS, SALES_ORDERS } from '../../services/mock/mock.data';
import { DEMO_CONFIG } from '../../core/config/demo.config';

function useCountUp(end, duration = 900) {
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

const KPIGauge = ({ label, current, target, unit, status = 'danger' }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);
  const animatedValue = useCountUp(current, 1000);
  const strokeColor = status === 'danger' ? '#E53935' : status === 'warning' ? '#F57C00' : '#00897B';
  
  return (
    <div className="flex flex-col items-center p-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="#1E2D45" strokeWidth="7" fill="transparent" />
          <circle cx="40" cy="40" r={radius} stroke={strokeColor} strokeWidth="7" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-bold" style={{ color: strokeColor }}>
            {animatedValue}{unit}
          </span>
        </div>
      </div>
      <span className="text-xs text-center mt-1" style={{ color: '#7A8BA8' }}>{label}</span>
      <span className="text-xs" style={{ color: '#445568' }}>目标{target}{unit}</span>
    </div>
  );
};

const AlertCard = ({ alert, onClick }) => {
  const isCritical = alert.level === 'critical';
  return (
    <div className={`p-3 rounded mb-2 cursor-pointer border ${isCritical ? 'pulse-danger' : ''}`}
      style={{ background: isCritical ? 'rgba(229,57,53,0.06)' : alert.level === 'warning' ? 'rgba(245,124,0,0.06)' : 'rgba(0,137,123,0.06)',
        borderColor: isCritical ? '#E53935' : alert.level === 'warning' ? '#F57C00' : '#00897B', }}
      onClick={onClick} >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs">{isCritical ? '🔴' : alert.level === 'warning' ? '🟡' : '🟢'}</span>
        <span className="font-display text-lg font-bold" style={{ color: '#E53935' }}>{alert.amount}</span>
      </div>
      <p className="text-sm mb-1" style={{ color: '#E8EDF4' }}>{alert.title}</p>
      <p className="text-xs flex items-center gap-1" style={{ color: '#7A8BA8' }}>
        <Clock className="w-3 h-3" />{alert.deadline}
      </p>
    </div>
  );
};

const PlantMap = () => (
  <div className="relative rounded overflow-hidden" style={{ height: '200px', background: '#0B0F17', border: '1px solid #1E2D45' }}>
    <svg viewBox="0 0 400 220" className="w-full h-full">
      <path d="M80,20 L120,18 L160,22 L200,30 L230,25 L260,35 L280,28 L300,40 L310,55 L305,70 L295,80 L290,95 L280,105 L270,115 L260,125 L250,130 L240,140 L230,150 L220,160 L210,175 L200,185"
        stroke="#1E2D45" fill="none" strokeWidth="1.5" />
      <path d="M200,185 L195,192 L190,200 L185,205 L188,210 L195,208 L200,205 L205,208 L208,205 L205,200"
        stroke="#1E2D45" fill="none" strokeWidth="1" />
      <line x1="310" y1="62" x2="295" y2="82" stroke="#2D7DD2" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="295" y1="95" x2="200" y2="195" stroke="#2D7DD2" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
      </line>
      <circle cx="310" cy="60" r="10" fill="#E53935" opacity="0.9" />
      <circle cx="310" cy="60" r="14" fill="none" stroke="#E53935" strokeWidth="1.5" opacity="0.4">
        <animate attributeName="r" from="10" to="18" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="310" y="80" textAnchor="middle" fill="#E8EDF4" fontSize="10" fontFamily="IBM Plex Sans">青岛总部</text>
      <text x="310" y="92" textAnchor="middle" fill="#E53935" fontSize="9" fontFamily="IBM Plex Sans">112% ⚠</text>
      <circle cx="295" cy="95" r="8" fill="#F57C00" opacity="0.9" />
      <text x="295" y="113" textAnchor="middle" fill="#E8EDF4" fontSize="10" fontFamily="IBM Plex Sans">苏州华东</text>
      <text x="295" y="125" textAnchor="middle" fill="#F57C00" fontSize="9" fontFamily="IBM Plex Sans">78%</text>
      <circle cx="200" cy="195" r="9" fill="#F57C00" opacity="0.8" />
      <text x="200" y="210" textAnchor="middle" fill="#E8EDF4" fontSize="10" fontFamily="IBM Plex Sans">泰国曼谷</text>
      <text x="200" y="222" textAnchor="middle" fill="#F57C00" fontSize="9" fontFamily="IBM Plex Sans">43% 爬坡中</text>
      <circle cx="20" cy="15" r="4" fill="#E53935" />
      <text x="28" y="19" fill="#7A8BA8" fontSize="9" fontFamily="IBM Plex Sans">超负荷</text>
      <circle cx="65" cy="15" r="4" fill="#F57C00" />
      <text x="73" y="19" fill="#7A8BA8" fontSize="9" fontFamily="IBM Plex Sans">正常/爬坡</text>
    </svg>
  </div>
);

const DEMO_PATHS = [
  { emoji: '🔴', title: 'Bühler断供危机', desc: '从预警→风险分析→采购决策', path: '/exceptions', color: '#E53935' },
  { emoji: '📦', title: '圣诞旺季备货', desc: '需求预测→ATP检查→MPS调整', path: '/demand', color: '#F57C00' },
  { emoji: '🏭', title: '产销协同评审', desc: 'S&OP产销平衡→会议决策', path: '/sop', color: '#2D7DD2' },
  { emoji: '🇹🇭', title: '泰国产能爬坡', desc: 'RCCP核查→多工厂协同', path: '/rccp', color: '#00897B' },
];

const DemoPathCard = ({ demo, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-3 rounded border transition-all hover:scale-[1.02]"
    style={{ 
      background: 'rgba(45,125,210,0.04)', 
      borderColor: `${demo.color}30` 
    }}>
    <span className="text-2xl">{demo.emoji}</span>
    <div className="text-left">
      <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{demo.title}</p>
      <p className="text-xs" style={{ color: '#7A8BA8' }}>{demo.desc}</p>
    </div>
  </button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(DEMO_CONFIG.company.daysToChristmasSeason);
  const animatedRisk = useCountUp(DEMO_CONFIG.riskAmount.total, 1200);
  
  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 86400000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>供应链指挥中心</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>{DEMO_CONFIG.company.demoDate} · 青岛总部</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right p-3 rounded" style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)' }}>
            <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>距圣诞旺季发货</p>
            <p className="font-display text-4xl font-bold" style={{ color: '#E53935' }}>{countdown}<span className="text-lg ml-1" style={{ color: '#7A8BA8' }}>天</span></p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '30% 42% 28%' }}>
        <div>
          <h2 className="text-base font-medium mb-3 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} /> 今日需要你决策的事 </h2>
          {ALERTS.map(alert => ( <AlertCard key={alert.id} alert={alert} onClick={() => navigate('/risk')} /> ))}
          <button onClick={() => navigate('/procurement')}
            className="w-full mt-3 p-3 rounded text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(45,125,210,0.08)', border: '1px solid rgba(45,125,210,0.3)', color: '#3D9BE9' }} >
            AI已识别 ¥{animatedRisk}万 潜在风险 → 查看全部建议 </button>
        </div>
        
        <div>
          <h2 className="text-base font-medium mb-3 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <Activity className="w-4 h-4" style={{ color: '#2D7DD2' }} /> 供应链健康度 </h2>
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-1">
              {KPI_DATA.map((kpi, i) => ( <KPIGauge key={i} {...kpi} /> ))}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xs mb-2 px-1" style={{ color: '#7A8BA8' }}>今日关键订单</h3>
            <div className="space-y-1.5">
              {SALES_ORDERS.slice(0, 3).map(order => (
                <div key={order.id} className="flex items-center justify-between p-2 rounded"
                  style={{ background: '#131926', border: '1px solid #1E2D45' }} >
                  <div className="flex items-center gap-2">
                    <span>{order.priority === 'critical' ? '🔴' : '🟡'}</span>
                    <span className="text-sm" style={{ color: '#E8EDF4' }}>{order.id}</span>
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>{order.customer}</span>
                  </div>
                  <span className="text-xs font-display" style={{ color: '#E53935' }}> ¥{(order.amount / 10000).toFixed(0)}万 </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-base font-medium mb-3 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <MapPin className="w-4 h-4" style={{ color: '#2D7DD2' }} /> 三厂运营状态 </h2>
          <div className="card p-3">
            <PlantMap />
            <div className="mt-3 space-y-1.5">
              {PLANT_STATUS.map((plant, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded"
                  style={{ background: '#0B0F17', border: '1px solid #1E2D45' }} >
                  <div className="flex items-center gap-2">
                    <Factory className="w-3.5 h-3.5" style={{ color: '#7A8BA8' }} />
                    <span className="text-sm" style={{ color: '#E8EDF4' }}>{plant.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base"
                      style={{ color: plant.utilization > 100 ? '#E53935' : plant.utilization < 60 ? '#F57C00' : '#00897B' }}>
                      {plant.utilization}%
                    </span>
                    <span className="text-xs">{plant.utilization > 100 ? '🔴' : '🟡'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 典型演示路径快捷入口 */}
      <div className="mt-6 p-4 rounded border" style={{ background: 'rgba(45,125,210,0.04)', borderColor: 'rgba(45,125,210,0.15)' }}>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <Zap className="w-4 h-4" style={{ color: '#F57C00' }} /> 典型演示路径
        </h3>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {DEMO_PATHS.map((demo, idx) => (
            <DemoPathCard key={idx} demo={demo} onClick={() => navigate(demo.path)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
