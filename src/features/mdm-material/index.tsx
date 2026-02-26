import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, Save, X } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 物料主数据管理页面
 */
const MaterialManagementPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    materialName: '',
    materialNameEn: '',
    materialGroup: '',
    materialType: 'ROH',
    baseUnit: '',
    defaultSupplier: '',
    moq: 0,
    leadTime: 0,
    abcClass: '',
    safetyStock: 0,
    storageLocation: '',
  });

  // 模拟数据
  useEffect(() => {
    const mockData = [
      { materialId: 'MAT-20260215-001', materialName: '电机 A 型', materialGroup: '电机', materialType: 'ROH', baseUnit: '个', abcClass: 'A', safetyStock: 100, status: 'ACTIVE' },
      { materialId: 'MAT-20260215-002', materialName: '轴承 B 型', materialGroup: '轴承', materialType: 'ROH', baseUnit: '个', abcClass: 'A', safetyStock: 200, status: 'ACTIVE' },
      { materialId: 'MAT-20260215-003', materialName: '外壳 C 型', materialGroup: '外壳', materialType: 'ROH', baseUnit: '个', abcClass: 'B', safetyStock: 150, status: 'ACTIVE' },
      { materialId: 'MAT-20260215-004', materialName: '控制器总成', materialGroup: '控制器', materialType: 'HALB', baseUnit: '个', abcClass: 'A', safetyStock: 50, status: 'ACTIVE' },
      { materialId: 'MAT-20260215-005', materialName: '线性驱动装置 LA23', materialGroup: '成品', materialType: 'FERT', baseUnit: '套', abcClass: 'A', safetyStock: 30, status: 'ACTIVE' },
    ];
    setMaterials(mockData);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    // 模拟搜索
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      materialName: material.materialName,
      materialNameEn: '',
      materialGroup: material.materialGroup,
      materialType: material.materialType,
      baseUnit: material.baseUnit,
      defaultSupplier: '',
      moq: 0,
      leadTime: 0,
      abcClass: material.abcClass,
      safetyStock: material.safetyStock,
      storageLocation: '',
    });
    setShowForm(true);
  };

  const handleDelete = (materialId) => {
    if (window.confirm('确定删除此物料？')) {
      setMaterials(materials.filter(m => m.materialId !== materialId));
    }
  };

  const handleSave = () => {
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.materialId === editingMaterial.materialId 
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMaterial = {
        materialId: 'MAT-' + Date.now().toString().slice(-6),
        ...formData,
        status: 'ACTIVE'
      };
      setMaterials([...materials, newMaterial]);
    }
    setShowForm(false);
    setEditingMaterial(null);
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📦 物料主数据管理
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSearch}>
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm" onClick={() => { setEditingMaterial(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-1" />
            新建物料
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>物料总数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{materials.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>原材料</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>
            {materials.filter(m => m.materialType === 'ROH').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>半成品</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {materials.filter(m => m.materialType === 'HALB').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>成品</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {materials.filter(m => m.materialType === 'FERT').length}
          </div>
        </Card>
      </div>

      {/* 搜索栏 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#445568' }} />
            <input
              type="text"
              placeholder="搜索物料编码/名称..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Button variant="ghost" onClick={handleSearch}>搜索</Button>
        </div>
      </Card>

      {/* 物料列表 */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#1E2D45' }}>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>物料编码</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>物料名称</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>物料组</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>类型</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>ABC</th>
                <th className="text-right py-3 px-3" style={{ color: '#7A8BA8' }}>安全库存</th>
                <th className="text-center py-3 px-3" style={{ color: '#7A8BA8' }}>状态</th>
                <th className="text-center py-3 px-3" style={{ color: '#7A8BA8' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material, i) => (
                <tr key={i} className="border-b hover:bg-slate-800/50" style={{ borderColor: '#1E2D45' }}>
                  <td className="py-3 px-3 font-mono" style={{ color: '#2D7DD2' }}>{material.materialId}</td>
                  <td className="py-3 px-3" style={{ color: '#E8EDF4' }}>{material.materialName}</td>
                  <td className="py-3 px-3" style={{ color: '#7A8BA8' }}>{material.materialGroup}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded"
                      style={{ 
                        background: material.materialType === 'ROH' ? 'rgba(45,125,210,0.1)' : 
                                   material.materialType === 'HALB' ? 'rgba(245,124,0,0.1)' : 'rgba(0,137,123,0.1)',
                        color: material.materialType === 'ROH' ? '#2D7DD2' : 
                               material.materialType === 'HALB' ? '#F57C00' : '#00897B'
                      }}>
                      {material.materialType}
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{ color: '#E8EDF4' }}>{material.abcClass}</td>
                  <td className="py-3 px-3 text-right" style={{ color: '#E8EDF4' }}>{material.safetyStock}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs px-2 py-1 rounded"
                      style={{ 
                        background: material.status === 'ACTIVE' ? 'rgba(0,137,123,0.1)' : 'rgba(245,124,0,0.1)',
                        color: material.status === 'ACTIVE' ? '#00897B' : '#F57C00'
                      }}>
                      {material.status === 'ACTIVE' ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-1 rounded hover:bg-slate-700"
                        style={{ color: '#7A8BA8' }}
                        onClick={() => handleEdit(material)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 rounded hover:bg-red-900/30"
                        style={{ color: '#E53935' }}
                        onClick={() => handleDelete(material.materialId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-2xl" style={{ background: '#0B0F17' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display" style={{ color: '#E8EDF4' }}>
                {editingMaterial ? '编辑物料' : '新建物料'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingMaterial(null); }}>
                <X className="w-5 h-5" style={{ color: '#7A8BA8' }} />
              </button>
            </div>
            
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>物料名称 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.materialName}
                  onChange={(e) => setFormData({...formData, materialName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>物料组 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.materialGroup}
                  onChange={(e) => setFormData({...formData, materialGroup: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>物料类型 *</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.materialType}
                  onChange={(e) => setFormData({...formData, materialType: e.target.value})}
                >
                  <option value="ROH">原材料</option>
                  <option value="HALB">半成品</option>
                  <option value="FERT">成品</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>基本单位 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.baseUnit}
                  onChange={(e) => setFormData({...formData, baseUnit: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>ABC分类</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.abcClass}
                  onChange={(e) => setFormData({...formData, abcClass: e.target.value})}
                >
                  <option value="">请选择</option>
                  <option value="A">A类</option>
                  <option value="B">B类</option>
                  <option value="C">C类</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7A8BA8' }}>安全库存</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  value={formData.safetyStock}
                  onChange={(e) => setFormData({...formData, safetyStock: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditingMaterial(null); }}>
                取消
              </Button>
              <Button onClick={handleSave}>
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

export default MaterialManagementPage;
