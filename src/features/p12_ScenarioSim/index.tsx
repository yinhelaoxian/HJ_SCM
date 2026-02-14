import React, { useState } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

const scenarios = [
  { id: 'base', name: '基准场景', description: '当前计划', color: '#2D7DD2', active: true },
  { id: 'buhler', name: 'Bühler断供', description: '德国供应商断供6周', color: '#E53935', active: false },
  { id: 'ikea', name: 'IKEA提前', description: '客户提前3周发货', color: '#F57C00', active: false },
  { id: 'thailand', name: '泰国产能', description: '泰国工厂增产50%', color: '#00897B', active: false }
];

const ScenarioSim: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState('base');
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>情景模拟工作台</h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>What-if分析，辅助决策</p>
        </div>
      </div>
      
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>模拟场景</h3>
          <div className="space-y-2">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className="w-full p-3 rounded text-left transition-all"
                style={{
                  background: activeScenario === s.id ? `${s.color}20` : 'transparent',
                  borderLeft: `3px solid ${activeScenario === s.id ? s.color : 'transparent'}`
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{s.name}</span>
                  {activeScenario === s.id && <Play className="w-4 h-4" style={{ color: s.color }} />}
                </div>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{s.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>
            {scenarios.find(s => s.id === activeScenario)?.name} - 影响分析
          </h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: '#E53935' }} />
              <p className="text-xs" style={{ color: '#7A8BA8' }}>需求影响</p>
              <p className="text-xl font-display mt-1" style={{ color: '#E53935' }}>+18%</p>
            </div>
            <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
              <TrendingDown className="w-5 h-5 mb-2" style={{ color: '#00897B' }} />
              <p className="text-xs" style={{ color: '#7A8BA8' }}>供应影响</p>
              <p className="text-xl font-display mt-1" style={{ color: '#F57C00' }}>-15%</p>
            </div>
            <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
              <DollarSign className="w-5 h-5 mb-2" style={{ color: '#2D7DD2' }} />
              <p className="text-xs" style={{ color: '#7A8BA8' }}>成本影响</p>
              <p className="text-xl font-display mt-1" style={{ color: '#F57C00' }}>+¥230万</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSim;
