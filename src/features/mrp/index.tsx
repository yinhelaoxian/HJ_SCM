import React from 'react';
import { RefreshCw, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * MRP 运算页面
 * 
 * 功能：净需求计算、建议订单生成、物料分解
 */
const MRPPage = () => {
  const suggestions = [
    { sku: 'MAT-001', name: '电机 A', current: 150, required: 500, gap: -350,建议: 500, type: '采购' },
    { sku: 'MAT-002', name: '轴承 B', current: 200, required: 300, gap: -100,建议: 300, type: '采购' },
    { sku: 'MAT-003', name: '外壳 C', current: 80, required: 80, gap: 0,建议: 0, type: '-' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          ⚙️ MRP 运算
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            重新运算
          </Button>
          <Button size="sm">
            <ArrowRight className="w-4 h-4 mr-1" />
            下达建议
          </Button>
        </div>
      </div>

      {/* MRP 概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>运算时间</div>
          <div className="text-lg font-display" style={{ color: '#E8EDF4' }}>2026-02-15</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>最近一次</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>建议总数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>23</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>采购/生产</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>物料缺口</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需要关注</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>建议金额</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>¥125K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>预计成本</div>
        </Card>
      </div>

      {/* 建议列表 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>MRP 建议清单</h3>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#445568' }}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#E53935' }}></span>
              紧急
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#F57C00' }}></span>
              关注
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#00897B' }}></span>
              正常
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#1E2D45' }}>
                <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>物料编码</th>
                <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>物料名称</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>当前库存</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>需求</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>缺口</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>建议数量</th>
                <th className="text-center py-2 px-3" style={{ color: '#7A8BA8' }}>类型</th>
                <th className="text-center py-2 px-3" style={{ color: '#7A8BA8' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((item, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#1E2D45' }}>
                  <td className="py-2 px-3 font-mono" style={{ color: '#2D7DD2' }}>{item.sku}</td>
                  <td className="py-2 px-3" style={{ color: '#E8EDF4' }}>{item.name}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#E8EDF4' }}>{item.current}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#E8EDF4' }}>{item.required}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={item.gap < 0 ? 'font-medium' : ''}
                      style={{ color: item.gap < 0 ? '#E53935' : '#00897B' }}>
                      {item.gap}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-medium" style={{ color: '#E8EDF4' }}>{item.建议}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        background: item.type === '采购' ? 'rgba(45,125,210,0.1)' : 'transparent',
                        color: item.type === '采购' ? '#2D7DD2' : '#445568'
                      }}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Button variant="ghost" size="xs">确认</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MRPPage;
