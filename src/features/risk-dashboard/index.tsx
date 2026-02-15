import React from 'react';
import { TrendingUp, Package, Factory, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 风险监控页面 - 风险三道防线
 * 
 * ISC 框架：风险管理模块
 * 第一道防线：预测准确率
 * 第二道防线：库存缓冲
 * 第三道防线：执行敏捷
 */
const RiskDashboardPage = () => {
  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🛡️ 风险监控
        </h1>
        <Button size="sm">
          生成报告
        </Button>
      </div>

      {/* 风险三道防线概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {/* 第一道防线：预测 */}
        <Card className="p-4 border-t-2" style={{ borderColor: '#2D7DD2' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" style={{ color: '#2D7DD2' }} />
            <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>第一道防线</h3>
            <span className="text-xs px-2 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(0,137,123,0.1)', color: '#00897B' }}>
              健康
            </span>
          </div>
          <div className="text-sm mb-2" style={{ color: '#7A8BA8' }}>预测准确率</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold" style={{ color: '#2D7DD2' }}>87%</span>
            <span className="text-sm mb-1" style={{ color: '#00897B' }}>↑ 3%</span>
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>促销预测</span>
              <span style={{ color: '#E8EDF4' }}>82%</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>新品预测</span>
              <span style={{ color: '#E8EDF4' }}>76%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: '#7A8BA8' }}>季节预测</span>
              <span style={{ color: '#E8EDF4' }}>91%</span>
            </div>
          </div>
        </Card>

        {/* 第二道防线：库存 */}
        <Card className="p-4 border-t-2" style={{ borderColor: '#00897B' }}>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5" style={{ color: '#00897B' }} />
            <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>第二道防线</h3>
            <span className="text-xs px-2 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(245,124,0,0.1)', color: '#F57C00' }}>
              关注
            </span>
          </div>
          <div className="text-sm mb-2" style={{ color: '#7A8BA8' }}>库存缓冲覆盖率</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold" style={{ color: '#00897B' }}>78%</span>
            <span className="text-sm mb-1" style={{ color: '#F57C00' }}>↓ 5%</span>
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>安全库存</span>
              <span style={{ color: '#E8EDF4' }}>85%</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>缓冲水位</span>
              <span style={{ color: '#E8EDF4' }}>72%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: '#7A8BA8' }}>多级优化</span>
              <span style={{ color: '#E8EDF4' }}>68%</span>
            </div>
          </div>
        </Card>

        {/* 第三道防线：执行 */}
        <Card className="p-4 border-t-2" style={{ borderColor: '#F57C00' }}>
          <div className="flex items-center gap-2 mb-3">
            <Factory className="w-5 h-5" style={{ color: '#F57C00' }} />
            <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>第三道防线</h3>
            <span className="text-xs px-2 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(0,137,123,0.1)', color: '#00897B' }}>
              健康
            </span>
          </div>
          <div className="text-sm mb-2" style={{ color: '#7A8BA8' }}>执行敏捷度</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold" style={{ color: '#F57C00' }}>92%</span>
            <span className="text-sm mb-1" style={{ color: '#00897B' }}>↑ 2%</span>
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>供应商响应</span>
              <span style={{ color: '#E8EDF4' }}>95%</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#7A8BA8' }}>生产弹性</span>
              <span style={{ color: '#E8EDF4' }}>88%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: '#7A8BA8' }}>预警速度</span>
              <span style={{ color: '#E8EDF4' }}>94%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 综合风险评分 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>综合风险评分</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: '#7A8BA8' }}>整体风险</span>
              <span className="text-sm font-medium" style={{ color: '#F57C00' }}>中风险 (42%)</span>
            </div>
            <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '42%', background: '#F57C00' }} />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#7A8BA8' }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: '#00897B' }}></span>
              低风险 (0-30%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: '#F57C00' }}></span>
              中风险 (30-60%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: '#E53935' }}></span>
              高风险 (60%+)
            </span>
          </div>
        </div>
      </Card>

      {/* 风险建议 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>风险缓解建议</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(245,124,0,0.08)' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#F57C00' }} />
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: '#F57C00' }}>第二道防线需加强</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                建议增加 A 类物料安全库存 15%，预计降低缺货风险 8%
              </div>
            </div>
            <Button variant="outline" size="xs">执行</Button>
          </div>
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(0,137,123,0.08)' }}>
            <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#00897B' }} />
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: '#00897B' }}>预测模型表现良好</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                季节性预测准确率提升 5%，建议推广至其他产品线
              </div>
            </div>
            <Button variant="outline" size="xs" style={{ color: '#00897B' }}>详情</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskDashboardPage;
