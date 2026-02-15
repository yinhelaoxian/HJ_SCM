import React, { useState } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * BOM管理页面
 */
const BOMManagementPage = () => {
  const [boms, setBoms] = useState([
    { 
      bomId: 'BOM-20260215-001', 
      bomName: 'LA23 BOM', 
      material: '线性驱动装置 LA23', 
      bomLevel: 1, 
      status: 'ACTIVE',
      components: [
        { componentMaterial: '电机 A 型', componentQty: 1, operationId: 'OP10' },
        { componentMaterial: '轴承 B 型', componentQty: 2, operationId: 'OP10' },
        { componentMaterial: '外壳 C 型', componentQty: 1, operationId: 'OP20' },
        { componentMaterial: '控制器总成', componentQty: 1, operationId: 'OP30' },
      ]
    },
  ]);
  const [expandedBom, setExpandedBom] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const toggleExpand = (bomId) => {
    setExpandedBom(expandedBom === bomId ? null : bomId);
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🏗️ BOM管理
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            新建BOM
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>BOM总数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{boms.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>启用状态</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {boms.filter(b => b.status === 'ACTIVE').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>层级最深</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {Math.max(...boms.map(b => b.bomLevel))} 层
          </div>
        </Card>
      </div>

      {/* BOM列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {boms.map((bom, i) => (
            <div key={i}>
              <div 
                className="flex items-center justify-between p-4 rounded border cursor-pointer"
                style={{ background: '#131926', borderColor: '#1E2D45' }}
                onClick={() => toggleExpand(bom.bomId)}
              >
                <div className="flex items-center gap-4">
                  {expandedBom === bom.bomId ? 
                    <ChevronDown className="w-5 h-5" style={{ color: '#7A8BA8' }} /> :
                    <ChevronRight className="w-5 h-5" style={{ color: '#7A8BA8' }} />
                  }
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{bom.bomId}</span>
                      <span className="text-sm" style={{ color: '#E8EDF4' }}>{bom.bomName}</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#445568' }}>
                      父级: {bom.material} | 层级: {bom.bomLevel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 rounded"
                    style={{ 
                      background: bom.status === 'ACTIVE' ? 'rgba(0,137,123,0.1)' : 'rgba(245,124,0,0.1)',
                      color: bom.status === 'ACTIVE' ? '#00897B' : '#F57C00'
                    }}>
                    {bom.status === 'ACTIVE' ? '启用' : '停用'}
                  </span>
                  <span className="text-xs" style={{ color: '#7A8BA8' }}>
                    子件: {bom.components.length} 项
                  </span>
                </div>
              </div>

              {/* 子件列表 */}
              {expandedBom === bom.bomId && (
                <div className="ml-8 mt-2 p-4 rounded border-l-2"
                  style={{ background: 'rgba(45,125,210,0.05)', borderColor: '#2D7DD2' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium" style={{ color: '#7A8BA8' }}>BOM子件清单</h4>
                    <Button variant="ghost" size="xs">
                      <Plus className="w-3 h-3 mr-1" />
                      添加子件
                    </Button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#1E2D45' }}>
                        <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>子件物料</th>
                        <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>用量</th>
                        <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>工序</th>
                        <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>损耗率</th>
                        <th className="text-center py-2 px-3" style={{ color: '#7A8BA8' }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bom.components.map((comp, j) => (
                        <tr key={j} className="border-b" style={{ borderColor: '#1E2D45' }}>
                          <td className="py-2 px-3" style={{ color: '#E8EDF4' }}>{comp.componentMaterial}</td>
                          <td className="py-2 px-3" style={{ color: '#E8EDF4' }}>{comp.componentQty}</td>
                          <td className="py-2 px-3" style={{ color: '#445568' }}>{comp.operationId}</td>
                          <td className="py-2 px-3" style={{ color: '#445568' }}>0%</td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1 rounded hover:bg-slate-700" style={{ color: '#7A8BA8' }}>
                                <Edit className="w-3 h-3" />
                              </button>
                              <button className="p-1 rounded hover:bg-red-900/30" style={{ color: '#E53935' }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BOMManagementPage;
