import React, { useState } from 'react';
import { Lightbulb, CheckCircle, Clock, TrendingDown, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

interface DecisionItem {
  id: string;
  title: string;
  impact: '高' | '中' | '低';
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  owner?: string;
  createdAt?: string;
}

const decisions: DecisionItem[] = [
  { id: 'D001', title: '启动Buhler备选供应商认证', impact: '高', status: 'pending', owner: '采购部 - 李明', createdAt: '2026-02-14' },
  { id: 'D002', title: '泰国工厂转产部分LA23', impact: '中', status: 'approved', owner: '生产部 - 张华', createdAt: '2026-02-12' },
  { id: 'D003', title: '上调LA23安全库存至5000', impact: '高', status: 'processing', owner: '供应链 - 王志远', createdAt: '2026-02-10' },
];

const Decision: React.FC = () => {
  const [decisionList, setDecisionList] = useState(decisions);

  const handleApprove = (id: string) => {
    setDecisionList(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'approved' as const } : d
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      pending: { bg: 'rgba(245,124,0,0.1)', color: '#FFB74D', text: '待审批' },
      processing: { bg: 'rgba(45,125,210,0.1)', color: '#64B5F6', text: '审批中' },
      approved: { bg: 'rgba(0,137,123,0.1)', color: '#4DB6AC', text: '已批准' },
      rejected: { bg: 'rgba(229,57,53,0.1)', color: '#EF9A9A', text: '已拒绝' },
    };
    const s = styles[status] || styles.pending;
    return (
      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: s.bg, color: s.color }}>
        {s.text}
      </span>
    );
  };

  const impactCard = (
    <Card className="p-4 h-full">
      <h3 className="text-sm font-medium mb-4" style={{ color: '#7A8BA8' }}>决策影响预估</h3>
      <div className="space-y-3">
        <div className="p-3 rounded" style={{ background: 'rgba(0,137,123,0.08)' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#4DB6AC' }} />
            <span className="text-xs" style={{ color: '#7A8BA8' }}>减少缺货损失</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#4DB6AC' }}>¥2,180万</p>
        </div>
        <div className="p-3 rounded" style={{ background: 'rgba(45,125,210,0.08)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" style={{ color: '#64B5F6' }} />
            <span className="text-xs" style={{ color: '#7A8BA8' }}>交货期缩短</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#64B5F6' }}>8 天</p>
        </div>
        <div className="p-3 rounded" style={{ background: 'rgba(245,124,0,0.08)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#FFB74D' }} />
            <span className="text-xs" style={{ color: '#7A8BA8' }}>成本节约</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#FFB74D' }}>¥95万</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#1E2D45' }}>
        <p className="text-xs" style={{ color: '#445568' }}>
          数据基于 13 周滚动预测模型计算，实际效果可能因市场变化而波动
        </p>
      </div>
    </Card>
  );

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-display mb-6 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
        <Lightbulb className="w-6 h-6" style={{ color: '#F57C00' }} />
        决策支持系统
      </h1>

      <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 2fr' }}>
        {/* 决策列表 */}
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center justify-between" style={{ color: '#7A8BA8' }}>
            <span>AI推荐决策</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#3D9BE9' }}>
              {decisionList.filter(d => d.status === 'pending').length} 项待审批
            </span>
          </h3>
          <div className="space-y-3">
            {decisionList.map(d => (
              <div key={d.id} className="p-4 rounded border transition-all" 
                style={{ 
                  background: d.status === 'pending' ? 'rgba(245,124,0,0.04)' : '#131926',
                  borderColor: d.status === 'pending' ? 'rgba(245,124,0,0.2)' : '#1E2D45'
                }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 mt-0.5" style={{ color: d.status === 'pending' ? '#F57C00' : '#4DB6AC' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{d.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                        {d.owner} · {d.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded" 
                      style={{ 
                        background: d.impact === '高' ? 'rgba(229,57,53,0.1)' : d.impact === '中' ? 'rgba(245,124,0,0.1)' : 'rgba(0,137,123,0.1)',
                        color: d.impact === '高' ? '#EF9A9A' : d.impact === '中' ? '#FFB74D' : '#4DB6AC'
                      }}>
                      影响力 {d.impact}
                    </span>
                    {getStatusBadge(d.status)}
                  </div>
                </div>
                
                {d.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(245,124,0,0.1)' }}>
                    <Button onClick={() => handleApprove(d.id)} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      批准
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Clock className="w-4 h-4 mr-1" />
                      驳回
                    </Button>
                  </div>
                )}
                
                {d.status === 'approved' && (
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#4DB6AC' }}>
                    <CheckCircle className="w-3 h-3" />
                    王志远 已批准启动备选供应商认证
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧影响预估 */}
        {impactCard}
      </div>
    </div>
  );
};

export default Decision;
