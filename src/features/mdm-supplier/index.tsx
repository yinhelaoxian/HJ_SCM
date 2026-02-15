import React, { useState } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Save, X, Star } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 供应商管理页面
 */
const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState([
    { 
      supplierId: 'SUP-20260215-001', 
      supplierName: 'Bühler Motor', 
      supplierType: '核心供应商', 
      category: '电机',
      tierLevel: 1,
      contactPerson: '张经理',
      phone: '+86-532-88888888',
      qualityRating: 4.5,
      deliveryRating: 4.8,
      status: 'ACTIVE'
    },
    { 
      supplierId: 'SUP-20260215-002', 
      supplierName: '宁波天阁', 
      supplierType: '一般供应商', 
      category: '轴承',
      tierLevel: 2,
      contactPerson: '李经理',
      phone: '+86-574-77777777',
      qualityRating: 4.2,
      deliveryRating: 4.5,
      status: 'ACTIVE'
    },
    { 
      supplierId: 'SUP-20260215-003', 
      supplierName: '苏州联达', 
      supplierType: '一般供应商', 
      category: '外壳',
      tierLevel: 2,
      contactPerson: '王经理',
      phone: '+86-512-66666666',
      qualityRating: 4.0,
      deliveryRating: 4.3,
      status: 'ACTIVE'
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierType: '',
    category: '',
    tierLevel: 3,
    contactPerson: '',
    phone: '',
    email: '',
  });

  const getTierColor = (tier) => {
    switch(tier) {
      case 1: return '#00897B';
      case 2: return '#2D7DD2';
      case 3: return '#445568';
      default: return '#445568';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#00897B';
    if (rating >= 4.0) return '#2D7DD2';
    if (rating >= 3.5) return '#F57C00';
    return '#E53935';
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🏢 供应商管理
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            新增供应商
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>供应商总数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{suppliers.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>核心供应商</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {suppliers.filter(s => s.tierLevel === 1).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>平均质量评分</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>
            {(suppliers.reduce((a, b) => a + b.qualityRating, 0) / suppliers.length).toFixed(1)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>平均交付评分</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {(suppliers.reduce((a, b) => a + b.deliveryRating, 0) / suppliers.length).toFixed(1)}
          </div>
        </Card>
      </div>

      {/* 供应商列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {suppliers.map((supplier, i) => (
            <div key={i} className="p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded flex items-center justify-center text-lg font-bold"
                    style={{ background: `${getTierColor(supplier.tierLevel)}20`, color: getTierColor(supplier.tierLevel) }}>
                    {supplier.supplierName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: '#E8EDF4' }}>{supplier.supplierName}</span>
                      <span className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          background: supplier.tierLevel === 1 ? 'rgba(0,137,123,0.1)' : 
                                     supplier.tierLevel === 2 ? 'rgba(45,125,210,0.1)' : 'rgba(68,85,104,0.2)',
                          color: getTierColor(supplier.tierLevel)
                        }}>
                        {supplier.tierLevel === 1 ? '一级' : supplier.tierLevel === 2 ? '二级' : '三级'}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                      {supplier.supplierId} | {supplier.category}
                    </div>
                    <div className="text-xs mt-2" style={{ color: '#445568' }}>
                      联系人: {supplier.contactPerson} | {supplier.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {/* 评分 */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#7A8BA8' }}>质量</div>
                      <div className="text-lg font-display font-bold" style={{ color: getRatingColor(supplier.qualityRating) }}>
                        {supplier.qualityRating}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#7A8BA8' }}>交付</div>
                      <div className="text-lg font-display font-bold" style={{ color: getRatingColor(supplier.deliveryRating) }}>
                        {supplier.deliveryRating}
                      </div>
                    </div>
                  </div>
                  {/* 操作 */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-slate-700" style={{ color: '#7A8BA8' }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded hover:bg-red-900/30" style={{ color: '#E53935' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-2xl" style={{ background: '#0B0F17' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display" style={{ color: '#E8EDF4' }}>新增供应商</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5" style={{ color: '#7A8BA8' }} />
              </button>
            </div>
            
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>供应商名称 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.supplierName}
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>供应商类型</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.supplierType}
                  onChange={(e) => setFormData({...formData, supplierType: e.target.value})}
                >
                  <option value="">请选择</option>
                  <option value="核心供应商">核心供应商</option>
                  <option value="一般供应商">一般供应商</option>
                  <option value="备选供应商">备选供应商</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>供应品类</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>分级</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.tierLevel}
                  onChange={(e) => setFormData({...formData, tierLevel: parseInt(e.target.value)})}
                >
                  <option value="1">一级（核心）</option>
                  <option value="2">二级（重要）</option>
                  <option value="3">三级（一般）</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>联系人</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>电话</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
              <Button>
                <Save className="w-4 h-4 mr-1" />
                保存
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SupplierManagementPage;
