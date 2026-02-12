// Page 1: 供应链指挥中心 Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, AlertTriangle, Clock, 
  MapPin, Factory, Package, Truck,
  ChevronRight, CheckCircle, Activity
} from 'lucide-react';
import { 
  KPI_DATA, ALERTS, PLANT_STATUS, 
  SALES_ORDERS 
} from '../../data/mock.data';
import { DEMO_CONFIG } from '../../config/demo.config';

const KPIGauge: React.FC<{ 
  label: string; 
  current: number; 
  target: number; 
  unit: string;
}> = ({ label, current, target, unit }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - percentage / 100);
  
  return (
    <div className="flex flex-col items-center p-3">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="var(--border)" strokeWidth="8" fill="transparent" />
          <circle 
            cx="48" cy="48" r="40" 
            stroke="var(--accent-blue)" 
            strokeWidth="8" 
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.39}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold">{current}{unit}</span>
        </div>
      </div>
      <span className="text-xs text-secondary mt-1">{label}</span>
      <span className="text-xs text-muted">目标{target}{unit}</span>
    </div>
  );
};

const AlertCard: React.FC<{ alert: typeof ALERTS[0]; onClick?: () => void }> = ({ alert, onClick }) => {
  const colors = {
    critical: 'alert-critical border-danger bg-danger-bg',
    warning: 'border-warning bg-warning-bg',
    normal: 'border-success bg-success-bg'
  };
  
  return (
    <div 
      className={`p-3 rounded mb-2 cursor-pointer ${colors[alert.level as keyof typeof colors]}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs">
          {alert.level === 'critical' ? '🔴' : alert.level === 'warning' ? '🟡' : '🟢'}
        </span>
        <span className="text-xs font-display text-danger">{alert.amount}</span>
      </div>
      <p className="text-sm text-primary mb-1">{alert.title}</p>
      <p className="text-xs text-secondary flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {alert.deadline}
      </p>
    </div>
  );
};

const PlantMap: React.FC = () => (
  <div className="relative h-64 bg-base rounded border border-border">
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* 简化的亚洲地图轮廓 */}
      <path d="M50,60 Q100,40 150,60 T250,80 T350,100" 
            stroke="var(--border)" fill="transparent" strokeWidth="1"/>
      
      {/* 青岛 */}
      <g className="cursor-pointer">
        <circle cx="320" cy="50" r="12" fill="var(--danger)" className="animate-pulse"/>
        <text x="320" y="75" textAnchor="middle" className="text-xs fill-text-primary">青岛</text>
        <text x="320" y="88" textAnchor="middle" className="text-xs fill-danger">112%</text>
      </g>
      
      {/* 苏州 */}
      <g className="cursor-pointer">
        <circle cx="330" cy="90" r="10" fill="var(--warning)"/>
        <text x="330" y="115" textAnchor="middle" className="text-xs fill-text-primary">苏州</text>
        <text x="330" y="128" textAnchor="middle" className="text-xs fill-warning">78%</text>
      </g>
      
      {/* 泰国 */}
      <g className="cursor-pointer">
        <circle cx="280" cy="140" r="12" fill="var(--warning)"/>
        <text x="280" y="165" textAnchor="middle" className="text-xs fill-text-primary">泰国</text>
        <text x="280" y="178" textAnchor="middle" className="text-xs fill-warning">43%</text>
      </g>
      
      {/* 物流流向线 */}
      <path d="M280,140 Q300,100 320,90" 
            stroke="var(--accent-blue)" fill="transparent" 
            strokeWidth="2" strokeDasharray="5,5"/>
      <path d="M280,140 Q260,100 320,50" 
            stroke="var(--accent-blue)" fill="transparent" 
            strokeWidth="2" strokeDasharray="5,5"/>
    </svg>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(47);
  
  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1), 86400000);
    return () => clearInterval(timer);
  }, []);
  
  const totalRisk = ALERTS.reduce((sum, a) => 
    sum + (a.level === 'critical' ? parseInt(a.amount.replace(/[^0-9]/g, '')) : 0), 0);
  
  return (
    <div className="page-enter">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary">供应链指挥中心</h1>
          <p className="text-sm text-secondary">2026年10月8日 · 青岛总部</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-secondary">距圣诞旺季发货</p>
            <p className="text-3xl font-display text-danger animate-count">{countdown}</p>
          </div>
        </div>
      </div>
      
      {/* 3列网格布局 */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* 左列：今日预警 */}
        <div className="col-span-3">
          <h2 className="text-lg font-medium text-primary mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-danger" />
            今日需要你决策的事
          </h2>
          {ALERTS.map(alert => (
            <AlertCard key={alert.id} alert={alert} onClick={() => navigate('/p5')} />
          ))}
          <button 
            onClick={() => navigate('/p5')}
            className="w-full mt-3 p-2 rounded border border-border text-sm text-secondary hover:bg-card-hover flex items-center justify-center"
          >
            AI已识别 ¥{totalRisk}万 潜在风险 → 查看全部建议
          </button>
        </div>
        
        {/* 中列：KPI仪表 */}
        <div className="col-span-5">
          <h2 className="text-lg font-medium text-primary mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-accent-blue" />
            KPI健康度
          </h2>
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-2">
              {KPI_DATA.map((kpi, i) => (
                <KPIGauge key={i} {...kpi} />
              ))}
            </div>
          </div>
          
          {/* 待办列表 */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-secondary mb-2">今日待办</h3>
            <div className="space-y-2">
              {SALES_ORDERS.slice(0, 4).map(order => (
                <div key={order.id} className="flex items-center justify-between p-2 card">
                  <div className="flex items-center gap-2">
                    {order.priority === 'critical' ? 
                      <span className="text-danger">🔴</span> : 
                      <span className="text-warning">🟡</span>
                    }
                    <span className="text-sm text-primary">{order.id}</span>
                    <span className="text-xs text-secondary">{order.customer}</span>
                  </div>
                  <span className="text-xs text-muted">{order.originalDeliveryDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 右列：三厂地图 */}
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-primary mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-accent-blue" />
            三厂运营状态
          </h2>
          <div className="card p-4">
            <PlantMap />
            <div className="mt-4 space-y-2">
              {PLANT_STATUS.map((plant, i) => (
                <div key={i} className="flex items-center justify-between p-2 border border-border rounded">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-primary">{plant.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display">{plant.utilization}%</span>
                    <span className="text-xs">{plant.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
