import { useState, useEffect } from 'react';

// 类型定义
export interface KPIData {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendText?: string;
  status?: 'ok' | 'warn' | 'normal';
}

export interface DefenseWall {
  id: number;
  title: string;
  description: string;
  layer: 'prevent' | 'buffer' | 'response';
  tags: string[];
  metrics: { label: string; value: string; color: string };
}

export interface SCORMetric {
  name: string;
  value: number;
  benchmark: number;
  color: string;
}

export interface PyramidLayer {
  level: string;
  name: string;
  desc: string;
  tags: string[];
  color: string;
  path: string; // 新增跳转路径
}

export interface SopStep {
  icon: string;
  title: string;
  desc: string;
}

export interface MpsZone {
  name: string;
  icon: string;
  desc: string;
  status: 'frozen' | 'slushy' | 'free';
}

export interface DeliveryMode {
  code: string;
  name: string;
  icon: string;
  type: 'mts' | 'dp' | 'eto';
}

export interface FourPillar {
  icon: string;
  title: string;
  sub: string;
  desc: string;
  color: string;
  path: string; // 新增跳转路径
}

export interface HeaderStats {
  planAchieve: string;
  avgDelivery: string;
  riskLevel: string;
  period: string;
}

export const useControlTower = () => {
  const [data, setData] = useState<{
    headerStats: HeaderStats;
    kpiData: KPIData[];
    pyramidLayers: PyramidLayer[];
    sopSteps: SopStep[];
    mpsZones: MpsZone[];
    defenseWalls: DefenseWall[];
    deliveryModes: DeliveryMode[];
    scorData: SCORMetric[];
    fourPillars: FourPillar[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟 API 请求
    const fetchData = async () => {
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockData = {
          headerStats: {
            planAchieve: '98.2%',
            avgDelivery: '4.2天',
            riskLevel: 'S3',
            period: '2026/02'
          },
          kpiData: [
            { label: '订单交付准时率 (OTD)', value: '96.8%', trend: 'up', trendText: '+1.2% vs 上月', status: 'ok' },
            { label: '库存周转天数 (DOI)', value: '18.4', trend: 'down', trendText: '-2天 优化中', status: 'warn' },
            { label: '预测准确率 (FA)', value: '99.1%', trend: 'up', trendText: '+0.8%', status: 'ok' },
            { label: '供应商异常率 (SQR)', value: '4.6%', trend: 'stable', trendText: '→ 持平', status: 'normal' },
            { label: '产能利用率 (CU)', value: '87.3%', trend: 'up', trendText: '+3.1%', status: 'ok' },
            { label: '紧急物料缺货率', value: '2.1%', trend: 'down', trendText: '▼ 需关注', status: 'warn' },
          ],
          pyramidLayers: [
            {
              level: '战略层 · 1-3年',
              name: '长期规划与资源配置',
              desc: '基于市场趋势和商业战略，制定长期预望与资源配置方案。',
              tags: ['市场趋势分析', '网络设计', '资源配置', 'Make/Buy'],
              color: 'orange',
              path: '/strategy'
            },
            {
              level: '战术层 · 3-18个月',
              name: '中期平衡与容量规划',
              desc: '滚动计划周期内，平衡供需关系，管理产能约束。',
              tags: ['产能规划', '库存策略', '产品组合', 'S&OP输入'],
              color: 'blue',
              path: '/sop'
            },
            {
              level: '执行层 · 周/日作业',
              name: '即时响应与实时物流',
              desc: '按主计划分解执行，响应实时变化，驱动调度。',
              tags: ['详细排程', '派工单', '实时物流', '异常处理'],
              color: 'teal',
              path: '/mps'
            }
          ],
          sopSteps: [
            { icon: '📊', title: '数据收集', desc: '销售、财务、数据汇总' },
            { icon: '📈', title: '需求计划', desc: '供需财务全局平衡' },
            { icon: '🏭', title: '供应计划', desc: '生产路径库产规划' },
            { icon: '🤝', title: '高管决策', desc: '跨职能共识确认' }
          ],
          mpsZones: [
            { name: '冻结区', icon: '🔒', desc: '保护即时生产', status: 'frozen' },
            { name: '泥泞区', icon: '⚠️', desc: '可商充裕次性', status: 'slushy' },
            { name: '自由区', icon: '🌐', desc: '开放未来调整', status: 'free' }
          ],
          defenseWalls: [
            {
              id: 1,
              title: '需求预测',
              layer: 'prevent',
              description: '运用统计算法、机器学习及CPFR，从源头降低需求不确定性。',
              tags: ['统计预测', 'AI建模', 'CPFR协同'],
              metrics: { label: '缺货率', value: '4.2%', color: 'cyan' }
            },
            {
              id: 2,
              title: '安全库存',
              layer: 'buffer',
              description: '基于服务水平目标与需求波动性，计算各SKU安全库存。',
              tags: ['服务水平 SL', '波动系数 CV', '安全库存模型'],
              metrics: { label: '服务水平', value: '98.6%', color: 'green' }
            },
            {
              id: 3,
              title: '执行响应',
              layer: 'response',
              description: '建立实时异常监控与快速响应机制，驱动跨职能协同。',
              tags: ['实时监控', '异常预警', '跨职能协同'],
              metrics: { label: '安全系数', value: '1.8x', color: 'orange' }
            }
          ],
          deliveryModes: [
            { code: 'MTS', name: 'Make-to-Stock', icon: '📦', type: 'mts' },
            { code: 'MTO', name: 'Make-to-Order', icon: '🔄', type: 'mts' },
            { code: 'CODP', name: '服务跳脱耦点', icon: '⚓', type: 'dp' },
            { code: 'ATO', name: 'Assemble-to-Order', icon: '⚙️', type: 'eto' },
            { code: 'ETO', name: 'Engineer-to-Order', icon: '📐', type: 'eto' }
          ],
          scorData: [
            { name: '可靠性 RL', value: 96, benchmark: 85, color: '#42a5f5' },
            { name: '响应性 RS', value: 82, benchmark: 80, color: '#26a69a' },
            { name: '敏捷性 AG', value: 75, benchmark: 80, color: '#ff9800' },
            { name: '成本 CO', value: 88, benchmark: 85, color: '#ab47bc' },
            { name: '资产效率 AM', value: 91, benchmark: 85, color: '#ef5350' }
          ],
          fourPillars: [
            {
              icon: '🔄',
              title: '流程 Process',
              sub: 'STOR逻辑',
              desc: '业务最佳实践固化，确保端到端流程标准化',
              color: 'cyan',
              path: '/process'
            },
            {
              icon: '🗄️',
              title: '数据 Data',
              sub: 'BOM / 主数据',
              desc: '确保执行的准确性与一致性，构建数据治理',
              color: 'orange',
              path: '/data'
            },
            {
              icon: '💻',
              title: '系统 System',
              sub: 'IT工具链',
              desc: '数字化驱动效率提升，ERP/APS/WMS集成',
              color: 'purple',
              path: '/system'
            },
            {
              icon: '👥',
              title: '组织 Org',
              sub: 'S&OP协同',
              desc: '确保改变方案落地执行，建立协同文化',
              color: 'green',
              path: '/org'
            }
          ]
        };

        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch control tower data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};
