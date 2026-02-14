import React, { useState } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

const scenarios = [
  { id: 'base', name: '基准场景', description: '当前计划', color: '#2D7DD2', active: true },
  { id: 'buhler', name: 'Bühler断供', description: '德国供应商断供6周', color: '#E53935', active: false },
  { id: 'ikea', name: 'IKEA提前', description: '客户提前3周发货', color: '#F57C00', active: false },
  { id: 'thailand', name: '泰国产能', description: '泰国工厂增产50%', color: '#00897B', active: false }
];

const SCENARIO_IMPACTS: Record<string, {
  demand: string;
  demandColor: string;
  supply: string;
  supplyColor: string;
  cost: string;
  costColor: string;
  summary: string;
}> = {
  base: {
    demand: '基准线',
    demandColor: '#7A8BA8',
    supply: '平衡',
    supplyColor: '#7A8BA8',
    cost: '基准',
    costColor: '#7A8BA8',
    summary: '当前计划正常执行，无需特殊干预。',
  },
  buhler: {
    demand: '-22%',
    demandColor: '#E53935',
    supply: '-38%',
    supplyColor: '#E53935',
    cost: '+¥410万',
    costColor: '#E53935',
    summary: 'Bühler断供6周将导致LA23产线停工，建议立即启动苏州精驱认证流程。',
  },
  ikea: {
    demand: '+31%',
    demandColor: '#E53935',
    supply: '-8%',
    supplyColor: '#F57C00',
    cost: '+¥190万',
    costColor: '#F57C00',
    summary: 'IKEA提前3周将透支第42-44周安全库存，建议青岛A线加班并启动泰国备货。',
  },
  thailand: {
    demand: '+12%',
    demandColor: '#00897B',
    supply: '+50%',
    supplyColor: '#00897B',
    cost: '-¥95万',
    costColor: '#00897B',
    summary: '泰国产能提升可有效缓解圣诞旺季压力，建议将2000件LA23转产泰国。',
  },
};

const ScenarioSim: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState('base');
  const [simulating, setSimulating] = useState(false);

  // 切换场景时加一个短暂的"模拟中"效果
  const handleScenarioChange = (id: string) => {
    setSimulating(true);
    setTimeout(() => {
      setActiveScenario(id);
      setSimulating(false);
    }, 600);
  };

  const impact = SCENARIO_IMPACTS[activeScenario];
  const currentScenario = scenarios.find(s => s.id === activeScenario)!;
  
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
                onClick={() => handleScenarioChange(s.id)}
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
            {currentScenario.name} · 影响分析
            {simulating && <span className="ml-2 text-xs" style={{ color: '#7A8BA8' }}>AI 模拟中...</span>}
          </h3>
          {simulating ? (
            <div className="flex items-center justify-center h-32" style={{ color: '#445568' }}>
              <span className="text-sm">正在计算影响...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
                  <TrendingUp className="w-5 h-5 mb-2" style={{ color: impact.demandColor }} />
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>需求影响</p>
                  <p className="text-xl font-display mt-1" style={{ color: impact.demandColor }}>{impact.demand}</p>
                </div>
                <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
                  <TrendingDown className="w-5 h-5 mb-2" style={{ color: impact.supplyColor }} />
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>供应影响</p>
                  <p className="text-xl font-display mt-1" style={{ color: impact.supplyColor }}>{impact.supply}</p>
                </div>
                <div className="p-4 rounded" style={{ background: '#0B0F17' }}>
                  <DollarSign className="w-5 h-5 mb-2" style={{ color: impact.costColor }} />
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>成本影响</p>
                  <p className="text-xl font-display mt-1" style={{ color: impact.costColor }}>{impact.cost}</p>
                </div>
              </div>
              <div className="p-3 rounded text-sm" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid rgba(45,125,210,0.2)', color: '#7A8BA8' }}>
                💡 {impact.summary}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSim;
