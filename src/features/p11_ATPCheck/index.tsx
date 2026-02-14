import React, { useState } from 'react';
import { Search, Clock, Package, Truck, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

type ATPStatus = 'available' | 'partial' | 'unavailable';

interface ATPResult {
  materialId: string;
  materialName: string;
  requestedQty: number;
  availableQty: number;
  atpDate: string;
  status: ATPStatus;
  breakdown: {
    onHand: number;
    incoming: number;
    reserved: number;
    safetyStock: number;
  };
}

const mockData: ATPResult[] = [
  {
    materialId: 'HJ-M05',
    materialName: 'DC马达总成',
    requestedQty: 18000,
    availableQty: 0,
    atpDate: '2026-11-15',
    status: 'unavailable',
    breakdown: { onHand: 630, incoming: 0, reserved: 630, safetyStock: 2000 }
  },
  {
    materialId: 'HJ-SP03',
    materialName: '精密弹簧',
    requestedQty: 5000,
    availableQty: 5000,
    atpDate: '2026-10-08',
    status: 'available',
    breakdown: { onHand: 8000, incoming: 2000, reserved: 5000, safetyStock: 3000 }
  },
  {
    materialId: 'HJ-LA23',
    materialName: '线性推杆35mm',
    requestedQty: 38000,
    availableQty: 28000,
    atpDate: '2026-10-15',
    status: 'partial',
    breakdown: { onHand: 3840, incoming: 24160, reserved: 0, safetyStock: 8000 }
  }
];

const ATPCheck: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderDate, setOrderDate] = useState('2026-10-08');
  const [results, setResults] = useState<ATPResult[]>(mockData);
  const [selected, setSelected] = useState<ATPResult | null>(null);
  
  const filtered = results.filter(r => 
    r.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusIcon = (status: ATPStatus) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-6 h-6" style={{ color: '#00897B' }} />;
      case 'partial': return <AlertTriangle className="w-6 h-6" style={{ color: '#F57C00' }} />;
      case 'unavailable': return <XCircle className="w-6 h-6" style={{ color: '#E53935' }} />;
    }
  };
  
  const getStatusBadge = (status: ATPStatus) => {
    const colors: Record<ATPStatus, { bg: string; text: string; label: string }> = {
      available: { bg: 'rgba(0,137,123,0.1)', color: '#00897B', label: '完全可用' },
      partial: { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', label: '部分可用' },
      unavailable: { bg: 'rgba(229,57,53,0.1)', color: '#E53935', label: '不可用' }
    };
    const c = colors[status];
    return (
      <span className="px-2 py-1 rounded text-xs" style={{ background: c.bg, color: c.color }}>
        {c.label}
      </span>
    );
  };
  
  const ATPBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
    </div>
  );
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>ATP 可承诺量检查</h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>基于库存和供应计划计算可承诺交期</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded" style={{ background: '#0B0F17', border: '1px solid #1E2D45' }}>
            <Clock className="w-4 h-4" style={{ color: '#7A8BA8' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>订单日期:</span>
            <input 
              type="date" 
              value={orderDate}
              onChange={e => setOrderDate(e.target.value)}
              className="bg-transparent text-sm outline-none"
              style={{ color: '#E8EDF4' }}
            />
          </div>
          <button className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
            style={{ background: '#2D7DD2', color: '#fff' }}>
            <RefreshCw className="w-4 h-4" />
            重新计算
          </button>
        </div>
      </div>
      
      <div className="flex gap-6 mb-6">
        <div className="flex-1 card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>待检查物料</p>
          <p className="text-2xl font-display" style={{ color: '#E8EDF4' }}>{filtered.length}</p>
        </div>
        <div className="flex-1 card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>完全可用</p>
          <p className="text-2xl font-display" style={{ color: '#00897B' }}>
            {filtered.filter(r => r.status === 'available').length}
          </p>
        </div>
        <div className="flex-1 card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>部分可用</p>
          <p className="text-2xl font-display" style={{ color: '#F57C00' }}>
            {filtered.filter(r => r.status === 'partial').length}
          </p>
        </div>
        <div className="flex-1 card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>不可用</p>
          <p className="text-2xl font-display" style={{ color: '#E53935' }}>
            {filtered.filter(r => r.status === 'unavailable').length}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 400px' }}>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4" style={{ color: '#445568' }} />
            <input 
              placeholder="搜索物料编号或名称"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#E8EDF4' }}
            />
          </div>
          
          <div className="space-y-3">
            {filtered.map(result => (
              <div 
                key={result.materialId}
                onClick={() => setSelected(result)}
                className={`p-4 rounded cursor-pointer transition-all ${
                  selected?.materialId === result.materialId ? '' : ''
                }`}
                style={{ 
                  background: selected?.materialId === result.materialId ? 'rgba(45,125,210,0.1)' : '#131926',
                  border: `1px solid ${selected?.materialId === result.materialId ? '#2D7DD2' : '#1E2D45'}`,
                  cursor: 'pointer'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{result.materialId}</p>
                      <p className="text-xs" style={{ color: '#7A8BA8' }}>{result.materialName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(result.status)}
                    <p className="text-xs mt-1" style={{ color: '#445568' }}>ATP: {result.atpDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7A8BA8' }}>可承诺: {result.availableQty.toLocaleString()}</span>
                      <span style={{ color: '#7A8BA8' }}>/{result.requestedQty.toLocaleString()}</span>
                    </div>
                    <ATPBar value={result.availableQty} max={result.requestedQty} color={
                      result.status === 'available' ? '#00897B' : 
                      result.status === 'partial' ? '#F57C00' : '#E53935'
                    } />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          {selected ? (
            <div className="card p-4 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(selected.status)}
                <h3 className="text-base font-medium" style={{ color: '#E8EDF4' }}>{selected.materialName}</h3>
                {getStatusBadge(selected.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                  <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>请求数量</p>
                  <p className="text-xl font-display" style={{ color: '#E8EDF4' }}>{selected.requestedQty.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                  <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>ATP日期</p>
                  <p className="text-xl font-display" style={{ color: '#E8EDF4' }}>{selected.atpDate}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t" style={{ borderColor: '#1E2D45' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#7A8BA8' }}>ATP分解</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7A8BA8' }}>在手库存</span>
                      <span style={{ color: '#7A8BA8' }}>{selected.breakdown.onHand.toLocaleString()}</span>
                    </div>
                    <ATPBar value={selected.breakdown.onHand} max={selected.requestedQty} color="#2D7DD2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7A8BA8' }}>计划接收</span>
                      <span style={{ color: '#7A8BA8' }}>{selected.breakdown.incoming.toLocaleString()}</span>
                    </div>
                    <ATPBar value={selected.breakdown.incoming} max={selected.requestedQty} color="#00897B" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7A8BA8' }}>已预留</span>
                      <span style={{ color: '#7A8BA8' }}>{selected.breakdown.reserved.toLocaleString()}</span>
                    </div>
                    <ATPBar value={selected.breakdown.reserved} max={selected.requestedQty} color="#F57C00" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7A8BA8' }}>安全库存</span>
                      <span style={{ color: '#7A8BA8' }}>{selected.breakdown.safetyStock.toLocaleString()}</span>
                    </div>
                    <ATPBar value={selected.breakdown.safetyStock} max={selected.requestedQty} color="#445568" />
                  </div>
                </div>
              </div>
              
              {selected.status !== 'available' && (
                <div className="mt-4 p-3 rounded" 
                  style={{ background: selected.status === 'unavailable' ? 'rgba(229,57,53,0.1)' : 'rgba(245,124,0,0.1)' }}>
                  <p className="text-xs font-medium" 
                    style={{ color: selected.status === 'unavailable' ? '#E53935' : '#F57C00' }}>
                    {selected.status === 'unavailable' ? '⚠️ 无法满足' : '💡 部分满足'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                    {selected.status === 'unavailable' 
                      ? '建议启动紧急采购或使用替代料'
                      : '建议分批交货或调整交期'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-4 text-center" style={{ background: '#0B0F17' }}>
              <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#445568' }} />
              <p className="text-sm" style={{ color: '#445568' }}>点击物料查看ATP分解</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATPCheck;
