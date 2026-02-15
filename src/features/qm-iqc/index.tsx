import React, { useState } from 'react';
import { Plus, Edit, Check, X, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * IQC来料检验页面
 */
const IQCInspectionPage = () => {
  const [inspections, setInspections] = useState([
    {
      id: 'IQC-20260215001',
      poNumber: 'PO-20260214001',
      supplier: 'Bühler Motor',
      material: '电机 A 型',
      batchNo: 'B20260215001',
      quantity: 100,
      inspectionDate: '2026-02-15',
      inspector: '张检验',
      result: 'PASS',
      items: [
        { name: '外观检查', standard: '无划痕', actual: '合格', result: 'OK' },
        { name: '尺寸测量', standard: '100±0.5mm', actual: '99.8mm', result: 'OK' },
        { name: '功能测试', standard: '运转正常', actual: '正常', result: 'OK' },
      ]
    },
    {
      id: 'IQC-20260215002',
      poNumber: 'PO-20260214002',
      supplier: '宁波天阁',
      material: '轴承 B 型',
      batchNo: 'B20260215002',
      quantity: 200,
      inspectionDate: '2026-02-15',
      inspector: '李检验',
      result: 'FAIL',
      items: [
        { name: '外观检查', standard: '无锈蚀', actual: '发现锈蚀', result: 'NG' },
        { name: '尺寸测量', standard: '50±0.3mm', actual: '49.5mm', result: 'OK' },
        { name: '旋转测试', standard: '灵活无卡顿', actual: '有卡顿', result: 'NG' },
      ]
    },
  ]);

  const getResultBadge = (result) => {
    if (result === 'PASS') {
      return { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '合格' };
    } else if (result === 'FAIL') {
      return { bg: 'rgba(229,57,53,0.1)', color: '#E53935', text: '不合格' };
    } else {
      return { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', text: '待判定' };
    }
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🔍 IQC来料检验
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            新建检验
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>今日检验</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{inspections.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>合格</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {inspections.filter(i => i.result === 'PASS').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>不合格</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {inspections.filter(i => i.result === 'FAIL').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>合格率</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>
            {Math.round(inspections.filter(i => i.result === 'PASS').length / inspections.length * 100)}%
          </div>
        </Card>
      </div>

      {/* 检验列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {inspections.map((inspection, i) => {
            const badge = getResultBadge(inspection.result);
            return (
              <div key={i} className="p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{inspection.id}</span>
                    <span className="text-sm" style={{ color: '#E8EDF4' }}>{inspection.material}</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
                      {inspection.supplier}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>
                      批次: {inspection.batchNo} | 数量: {inspection.quantity}
                    </span>
                    <span className="text-xs px-2 py-1 rounded"
                      style={{ background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </span>
                    <Button variant="ghost" size="xs">详情</Button>
                  </div>
                </div>
                
                {/* 检验明细 */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ color: '#7A8BA8' }}>
                        <th className="text-left py-2 px-2">检验项目</th>
                        <th className="text-left py-2 px-2">检验标准</th>
                        <th className="text-left py-2 px-2">实测值</th>
                        <th className="text-center py-2 px-2">判定</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspection.items.map((item, j) => (
                        <tr key={j} className="border-b" style={{ borderColor: '#1E2D45' }}>
                          <td className="py-2 px-2" style={{ color: '#E8EDF4' }}>{item.name}</td>
                          <td className="py-2 px-2" style={{ color: '#7A8BA8' }}>{item.standard}</td>
                          <td className="py-2 px-2" style={{ color: '#7A8BA8' }}>{item.actual}</td>
                          <td className="py-2 px-2 text-center">
                            {item.result === 'OK' ? (
                              <Check className="w-4 h-4 inline" style={{ color: '#00897B' }} />
                            ) : (
                              <X className="w-4 h-4 inline" style={{ color: '#E53935' }} />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* NCR处理 */}
                {inspection.result === 'FAIL' && (
                  <div className="mt-3 p-2 rounded flex items-center justify-between"
                    style={{ background: 'rgba(229,57,53,0.1)' }}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />
                      <span className="text-xs" style={{ color: '#E53935' }}>
                        触发 NCR 处理流程
                      </span>
                    </div>
                    <Button variant="outline" size="xs" style={{ borderColor: '#E53935', color: '#E53935' }}>
                      创建 NCR
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default IQCInspectionPage;
