import React from 'react';
import { Shield, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 安全库存页面
 * 
 * 功能：策略配置、覆盖率计算、阈值监控
 */
const SafetyStockPage = () => {
  const items = [
    { sku: 'MAT-001', name: '电机 A', ss: 200, actual: 180, coverage: 15, status: 'warning' },
    { sku: 'MAT-002', name: '轴承 B', ss: 100, actual: 120, coverage: 20, status: 'ok' },
    { sku: 'MAT-003', name: '外壳 C', ss: 150, actual: 80, coverage: 8, status: 'critical' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🛡️ 安全库存
        </h1>
        <Button size="sm">
          <Shield className="w-4 h-4 mr-1" />
          配置策略
        </Button>
      </div>

      {/* 安全库存概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>配置物料</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>156</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>已配置策略</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>正常</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>120</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>物料数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>关注</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>28</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>物料数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>低于 SS</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>物料数</div>
        </Card>
      </div>

      {/* 安全库存列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>安全库存监控</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#1E2D45' }}>
                <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>物料编码</th>
                <th className="text-left py-2 px-3" style={{ color: '#7A8BA8' }}>物料名称</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>安全库存</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>当前库存</th>
                <th className="text-right py-2 px-3" style={{ color: '#7A8BA8' }}>覆盖天数</th>
                <th className="text-center py-2 px-3" style={{ color: '#7A8BA8' }}>状态</th>
                <th className="text-center py-2 px-3" style={{ color: '#7A8BA8' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#1E2D45' }}>
                  <td className="py-2 px-3 font-mono" style={{ color: '#2D7DD2' }}>{item.sku}</td>
                  <td className="py-2 px-3" style={{ color: '#E8EDF4' }}>{item.name}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#E8EDF4' }}>{item.ss}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={item.actual < item.ss ? 'font-medium' : ''}
                      style={{ color: item.actual < item.ss ? '#E53935' : '#E8EDF4' }}>
                      {item.actual}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span style={{ color: item.coverage < 10 ? '#E53935' : item.coverage < 15 ? '#F57C00' : '#00897B' }}>
                      {item.coverage} 天
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        background: item.status === 'ok' ? 'rgba(0,137,123,0.1)' : 
                                   item.status === 'warning' ? 'rgba(245,124,0,0.1)' : 'rgba(229,57,53,0.1)',
                        color: item.status === 'ok' ? '#00897B' : 
                               item.status === 'warning' ? '#F57C00' : '#E53935'
                      }}>
                      {item.status === 'ok' ? '正常' : item.status === 'warning' ? '关注' : '紧急'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Button variant="ghost" size="xs">调整</Button>
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

export default SafetyStockPage;
