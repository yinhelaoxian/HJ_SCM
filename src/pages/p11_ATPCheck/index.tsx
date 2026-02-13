import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertTriangle, Package, Truck, Clock } from 'lucide-react';

// ATP结果类型
type ATPResult = {
  materialId: string;
  materialName: string;
  requestedQty: number;
  availableQty: number;
  atpDate: string;
  status: 'available' | 'partial' | 'unavailable';
  breakdown: {
    onHand: number;
    incoming: number;
    reserved: number;
    safetyStock: number;
  };
};

// 模拟ATP检查结果
const mockATPResults: ATPResult[] = [
  {
    materialId: 'HJ-M05',
    materialName: 'DC马达总成',
    requestedQty: 18000,
    availableQty: 630,
    atpDate: '2026-10-08',
    status: 'unavailable',
    breakdown: {
      onHand: 630,
      incoming: 0,
      reserved: 630,
      safetyStock: 2000
    }
  },
  {
    materialId: 'HJ-SP03',
    materialName: '精密弹簧',
    requestedQty: 5000,
    availableQty: 5000,
    atpDate: '2026-10-08',
    status: 'available',
    breakdown: {
      onHand: 8000,
      incoming: 2000,
      reserved: 5000,
      safetyStock: 3000
    }
  },
  {
    materialId: 'HJ-LA23',
    materialName: '线性推杆35mm',
    requestedQty: 38000,
    availableQty: 28000,
    atpDate: '2026-11-05',
    status: 'partial',
    breakdown: {
      onHand: 3840,
      incoming: 24160,
      reserved: 0,
      safetyStock: 8000
    }
  }
];

const ATP Check: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderDate, setOrderDate] = useState('2026-10-08');
  const [atpResults, setAtpResults] = useState<ATPResult[]>(mockATPResults);
  const [selectedMaterial, setSelectedMaterial] = useState<ATPResult | null>(null);
  
  const filteredResults = atpResults.filter(r =>
    r.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5" style={{ color: '#00897B' }} />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5" style={{ color: '#F57C00' }} />;
      case 'unavailable':
        return <Package className="w-5 h-5" style={{ color: '#E53935' }} />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      available: { bg: 'rgba(0,137,123,0.1)', color: '#00897B' },
      partial: { bg: 'rgba(245,124,0,0.1)', color: '#F57C00' },
      unavailable: { bg: 'rgba(229,57,53,0.1)', color: '#E53935' }
    };
    const badge = badges[status] || badges.available;
    const labels: Record<string, string> = {
      available: '完全可用',
      partial: '部分可用',
      unavailable: '不可用'
    };
    
    return (
      <span 
        className="px-2 py-0.5 rounded text-xs"
        style={{ background: badge.bg, color: badge.text }}
      >
        {labels[status]}
      </span>
    );
  };
  
  const ATPBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
    <div className="h-2 rounded-full bg-base overflow-hidden">
      <div 
        className="h-full rounded-full"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }}
      />
    </div>
  );
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            ATP 可承诺量检查
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>
            基于库存和供应计划计算可承诺量
          </p>
        </div>
      </div>
      
      {/* 搜索和日期 */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#445568' }} />
          <input
            type="text"
            placeholder="搜索物料编号或名称"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded text-sm"
            style={{ background: '#0B0F17', border: '1px solid #1E2D45', color: '#E8EDF4' }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: '#0B0F17', border: '1px solid #1E2D45' }}>
          <Clock className="w-4 h-4" style={{ color: '#7A8BA8' }} />
          <span className="text-sm" style={{ color: '#7A8BA8' }}>订单日期:</span>
          <input
            type="date"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
            className="text-sm"
            style={{ background: 'transparent', color: '#E8EDF4', border: 'none' }}
          />
        </div>
        <button 
          className="px-6 py-2 rounded text-sm font-medium"
          style={{ background: '#2D7DD2', color: '#fff' }}
        >
          执行ATP检查
        </button>
      </div>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* ATP结果列表 */}
        <div>
          <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>
            ATP检查结果
          </h3>
          <div className="space-y-3">
            {filteredResults.map(result => (
              <div 
                key={result.materialId}
                className="card p-4 cursor-pointer hover:bg-opacity-80"
                style={{ background: selectedMaterial?.materialId === result.materialId ? '#1A2235' : '#131926' }}
                onClick={() => setSelectedMaterial(result)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>
                          {result.materialId}
                        </span>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{result.materialName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display" style={{ color: result.status === 'unavailable' ? '#E53935' : '#E8EDF4' }}>
                      {result.availableQty.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: '#445568' }}>
                      / {result.requestedQty.toLocaleString()}件
                    </p>
                  </div>
                </div>
                
                {/* 进度条 */}
                <ATPBar 
                  value={result.availableQty} 
                  max={result.requestedQty}
                  color={result.status === 'available' ? '#00897B' : result.status === 'partial' ? '#F57C00' : '#E53935'}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* 详情面板 */}
        <div>
          {selectedMaterial ? (
            <div className="card p-4 sticky top-6">
              <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>
                ATP分解详情
              </h3>
              
              {/* 状态 */}
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(selectedMaterial.status)}
                <span style={{ color: '#E8EDF4' }}>{selectedMaterial.materialName}</span>
                {getStatusBadge(selectedMaterial.status)}
              </div>
              
              {/* 核心数据 */}
              <div className="space-y-4">
                <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                  <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>请求数量</p>
                  <p className="text-xl font-display" style={{ color: '#E8EDF4' }}>
                    {selectedMaterial.requestedQty.toLocaleString()} 件
                  </p>
                </div>
                
                <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                  <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>可承诺量</p>
                  <p className="text-xl font-display" 
                    style={{ color: selectedMaterial.status === 'unavailable' ? '#E53935' : '#00897B' }}>
                    {selectedMaterial.availableQty.toLocaleString()} 件
                  </p>
                </div>
                
                <div className="p-3 rounded" style={{ background: '#0B0F17' }}>
                  <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>ATP日期</p>
                  <p className="text-base" style={{ color: '#E8EDF4' }}>
                    {selectedMaterial.atpDate}
                  </p>
                </div>
              </div>
              
              {/* 分解 */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#1E2D45' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#7A8BA8' }}>ATP分解</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>在手库存</span>
                    <span style={{ color: '#E8EDF4' }}>{selectedMaterial.breakdown.onHand.toLocaleString()}</span>
                  </div>
                  <ATPBar value={selectedMaterial.breakdown.onHand} max={selectedMaterial.requestedQty} color="#2D7DD2" />
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>计划接收</span>
                    <span style={{ color: '#E8EDF4' }}>{selectedMaterial.breakdown.incoming.toLocaleString()}</span>
                  </div>
                  <ATPBar value={selectedMaterial.breakdown.incoming} max={selectedMaterial.requestedQty} color="#00897B" />
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>已预留</span>
                    <span style={{ color: '#E8EDF4' }}>{selectedMaterial.breakdown.reserved.toLocaleString()}</span>
                  </div>
                  <ATPBar value={selectedMaterial.breakdown.reserved} max={selectedMaterial.requestedQty} color="#F57C00" />
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>安全库存</span>
                    <span style={{ color: '#E8EDF4' }}>{selectedMaterial.breakdown.safetyStock.toLocaleString()}</span>
                  </div>
                  <ATPBar value={selectedMaterial.breakdown.safetyStock} max={selectedMaterial.requestedQty} color="#E53935" />
                </div>
              </div>
              
              {/* 建议 */}
              {selectedMaterial.status !== 'available' && (
                <div className="mt-4 p-3 rounded" 
                  style={{ background: selectedMaterial.status === 'unavailable' ? 'rgba(229,57,53,0.1)' : 'rgba(245,124,0,0.1)' }}>
                  <p className="text-xs font-medium mb-1" 
                    style={{ color: selectedMaterial.status === 'unavailable' ? '#E53935' : '#F57C00' }}>
                    {selectedMaterial.status === 'unavailable' ? '⚠️ 无法满足' : '💡 部分满足'}
                  </p>
                  <p className="text-xs" 
                    style={{ color: '#7A8BA8' }}>
                    {selectedMaterial.status === 'unavailable' 
                      ? '建议启动紧急采购或使用替代料'
                      : '建议分批交货或调整交期'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-4 text-center" style={{ background: '#0B0F17' }}>
              <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#445568' }} />
              <p className="text-sm" style={{ color: '#7A8BA8' }}>
                点击物料查看ATP分解详情
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATPCheck;
