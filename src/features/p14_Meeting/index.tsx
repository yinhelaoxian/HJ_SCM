import React, { useState } from 'react';
import { Calendar, Users, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

const Meeting: React.FC = () => {
  const [generating, setGenerating] = useState(false);

  const handleGenerateMinutes = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const timeline = [
    { phase: 'Pre-S&OP', status: 'completed', date: '2026-02-12', label: '需求与供应数据准备' },
    { phase: 'S&OP 评审', status: 'current', date: '2026-02-14', label: '产销平衡与决策确认' },
    { phase: '下月排期', status: 'upcoming', date: '2026-03-15', label: '3月S&OP 会议排期' },
  ];

  const agenda = [
    { step: '01', title: '需求评审', desc: '销售预测、客户订单、促销活动影响' },
    { step: '02', title: '供应评审', desc: '产能约束、供应商风险、库存策略' },
    { step: '03', title: '产销平衡', desc: '供需差距分析、备选方案讨论' },
    { step: '04', title: '财务确认', desc: '成本影响、预算调整、利润预测' },
    { step: '05', title: '决策发布', desc: '最终计划发布、行动项分配' },
  ];

  const resolutions = [
    { id: 'R001', title: '启动 Bühler 备选供应商认证', owner: '采购部 - 李明', deadline: '2026-02-28', status: '进行中' },
    { id: 'R002', title: '青岛 A 线设备检修计划', owner: '生产部 - 张华', deadline: '2026-02-20', status: '待启动' },
    { id: 'R003', title: 'HJ-LA23 安全库存上调至 5000', owner: '供应链 - 王志远', deadline: '2026-02-18', status: '已完成' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>S&OP 会议管理</h1>
        <Button onClick={handleGenerateMinutes} disabled={generating}>
          {generating ? '生成中...' : '📝 一键生成会议纪要'}
        </Button>
      </div>

      {/* 会议日历时间线 */}
      <Card className="mb-6 p-4">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <Calendar className="w-4 h-4" /> 2月 S&OP 流程进度
        </h3>
        <div className="flex items-center justify-between">
          {timeline.map((item, idx) => (
            <React.Fragment key={item.phase}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                  item.status === 'completed' ? 'bg-green-900 text-green-400' :
                  item.status === 'current' ? 'bg-blue-900 text-blue-400' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {item.status === 'completed' ? '✅' : item.status === 'current' ? '🔜' : '📅'}
                </div>
                <p className="text-xs mt-2 font-medium" style={{ color: '#E8EDF4' }}>{item.phase}</p>
                <p className="text-xs" style={{ color: '#445568' }}>{item.date}</p>
                <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{item.label}</p>
              </div>
              {idx < timeline.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-2" style={{ color: '#1E2D45' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* 会议议程模板 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <FileText className="w-4 h-4" /> 会议议程模板
          </h3>
          <div className="space-y-3">
            {agenda.map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded" 
                style={{ background: 'rgba(45,125,210,0.05)' }}>
                <span className="text-xs font-mono px-2 py-1 rounded" 
                  style={{ background: '#2D7DD2', color: '#fff' }}>{item.step}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 上次会议决议 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <CheckCircle className="w-4 h-4" /> 上次会议决议
          </h3>
          <div className="space-y-3">
            {resolutions.map((res) => (
              <div key={res.id} className="p-3 rounded border" style={{ borderColor: '#1E2D45', background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono" style={{ color: '#2D7DD2' }}>{res.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    res.status === '已完成' ? 'bg-green-900 text-green-400' :
                    res.status === '进行中' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>{res.status}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: '#E8EDF4' }}>{res.title}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#7A8BA8' }}>
                  <Users className="w-3 h-3" /> {res.owner}
                  <span className="mx-1">·</span>
                  <Clock className="w-3 h-3" /> {res.deadline}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Meeting;
