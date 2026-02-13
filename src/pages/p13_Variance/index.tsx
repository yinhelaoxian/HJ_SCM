import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, ArrowRight, User } from 'lucide-react';

const varianceData = [
  { 
    category: '需求差异', 
    items: [
      { name: 'IKEA订单调整', value: -5800, variance: '-13.3%', owner: '销售部' },
      { name: '顾家预测上调', value: 3400, variance: '+8.9%', owner: '销售部' },
      { name: '瑞哈订单取消', value: -1200, variance: '-22.4%', owner: '商务部' }
    ]
  },
  {
    category: '供应差异',
    items: [
      { name: 'Bühler断供', value: -12000, variance: '-100%', owner: '采购部' },
      { name: '泰国产能爬坡', value: 4800, variance: '+150%', owner: '生产部' }
    ]
  },
  {
    category: '财务差异',
    items: [
      { name: '原料涨价', value: -85, variance: '+12.3%', owner: '财务部' },
      { name: '物流成本', value: 23, variance: '+5.2%', owner: '物流部' }
    ]
  }
];

const Variance: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredData = selectedCategory === 'all' 
    ? varianceData 
    : varianceData.filter(d => d.category === selectedCategory);
  
  const totalVariance = filteredData.reduce((sum, cat) => 
    sum + cat.items.reduce((s, i) => s + i.value, 0), 0);
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>差异分析工作台</h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>S&OP差异根因分析与责任归属</p>
        </div>
      </div>
      
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>总差异</p>
          <p className="text-2xl font-display" style={{ color: totalVariance < 0 ? '#E53935' : '#00897B' }}>
            {totalVariance < 0 ? '' : '+'}{totalVariance.toLocaleString()}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>需求差异</p>
          <p className="text-2xl font-display" style={{ color: '#F57C00' }}>
            -3,600
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>供应差异</p>
          <p className="text-2xl font-display" style={{ color: '#F57C00' }}>
            -7,200
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>财务差异</p>
          <p className="text-2xl font-display" style={{ color: '#F57C00' }}>
            -62万
          </p>
        </div>
      </div>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card p-4">
          <div className="flex gap-2 mb-4">
            {['全部', '需求', '供应', '财务'].map((cat, i) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(['all', '需求差异', '供应差异', '财务差异'][i])}
                className="px-4 py-2 rounded text-sm"
                style={{ 
                  background: selectedCategory === ['all', '需求差异', '供应差异', '财务差异'][i] ? '#2D7DD2' : 'transparent',
                  color: selectedCategory === ['all', '需求差异', '供应差异', '财务差异'][i] ? '#fff' : '#7A8BA8'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {filteredData.map((cat, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-sm font-medium mb-2" style={{ color: '#E8EDF4' }}>{cat.category}</h3>
              {cat.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-3 rounded mb-2" style={{ background: '#0B0F17' }}>
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4" style={{ color: '#445568' }} />
                    <span className="text-sm" style={{ color: '#E8EDF4' }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ 
                      color: item.value < 0 ? '#E53935' : '#00897B'
                    }}>
                      {item.value < 0 ? '' : '+'}{item.value.toLocaleString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" 
                      style={{ background: item.variance < 0 ? 'rgba(229,57,53,0.1)' : 'rgba(0,137,123,0.1)',
                      color: item.variance < 0 ? '#E53935' : '#00897B' }}>
                      {item.variance}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#445568' }}>
                      <User className="w-3 h-3" />
                      {item.owner}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>责任分布</h3>
          {[
            { dept: '销售部', value: 40, color: '#2D7DD2' },
            { dept: '采购部', value: 35, color: '#E53935' },
            { dept: '生产部', value: 15, color: '#F57C00' },
            { dept: '财务部', value: 5, color: '#00897B' }
          ].map((d, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: '#7A8BA8' }}>{d.dept}</span>
                <span style={{ color: d.color }}>{d.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700">
                <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Variance;
