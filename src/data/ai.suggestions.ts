// AI建议数据
export const AI_SUGGESTIONS = [
  {
    id: "AI-2026-001",
    priority: "critical",
    urgencyHours: 48,
    title: "启动Bühler国内替代认证 + 紧急备货",
    actions: [
      "立即启动青岛恒达电机快速认证（建议绿色通道，14天完成）",
      "向Bühler追加确认最新交期，争取10月前分批到货",
      "苏州工厂调拨现有马达库存630件至青岛应急"
    ],
    ifExecute: "可保障IKEA SO-2026-3341按时交付（¥2,180万）",
    ifNotExecute: "10月16日后无法承诺IKEA圣诞订单，预计损失¥2,180万 + 客户关系损失",
    factors: [
      { name: "Bühler延期6周通知", weight: 42 },
      { name: "IKEA提前发货要求", weight: 31 },
      { name: "HJ-LA23库存仅8天用量", weight: 27 }
    ],
    historicalAccuracy: { total: 11, correct: 9, rate: 0.82 },
    relatedOrders: ["SO-2026-3341"],
    status: "pending"
  },
  {
    id: "AI-2026-002",
    priority: "critical",
    urgencyHours: 72,
    title: "评估IKEA提前发货对三厂排产的影响",
    actions: [
      "重新计算三厂合并产能，评估11月5日交货可行性",
      "如青岛产能不足，评估泰国工厂承接12,000件的可行性",
      "向IKEA反馈初步评估结果（建议10月11日前回复）"
    ],
    ifExecute: "锁定IKEA战略客户关系，维护¥1,340万追加订单机会",
    ifNotExecute: "IKEA可能将部分采购量转至竞品，影响长期合作",
    factors: [
      { name: "IKEA战略客户等级", weight: 45 },
      { name: "三厂综合产能富余度", weight: 33 },
      { name: "泰国工厂爬坡潜力评估", weight: 22 }
    ],
    historicalAccuracy: { total: 6, correct: 5, rate: 0.83 },
    relatedOrders: ["SO-2026-3341"],
    status: "pending"
  },
  {
    id: "AI-2026-003",
    priority: "high",
    urgencyHours: 168,
    title: "泰国工厂转产优化：承接HJ-LA23部分订单",
    actions: [
      "将泰国工厂LA15产线切换14%比例至LA23（预计净增产能4,800件/月）",
      "优先调配HJ-M05马达库存300件至泰国",
      "更新泰国工厂Q4排产计划"
    ],
    ifExecute: "泰国利用率提升至61%，每月增收¥43万，同时缓解青岛压力",
    ifNotExecute: "泰国工厂闲置产能持续浪费，当前日损失¥12万",
    factors: [
      { name: "泰国工厂产能闲置", weight: 48 },
      { name: "青岛产能瓶颈", weight: 35 },
      { name: "圣诞订单紧迫度", weight: 17 }
    ],
    historicalAccuracy: { total: 4, correct: 3, rate: 0.75 },
    relatedOrders: ["SO-2026-3341"],
    status: "pending"
  },
  {
    id: "AI-2026-004",
    priority: "medium",
    urgencyHours: 336,
    title: "汇率锁定建议：泰铢采购优化",
    actions: [
      "评估泰铢远期合约锁定汇率",
      "调整泰国本地采购付款周期"
    ],
    ifExecute: "预计每季度节省¥18万汇率波动损失",
    ifNotExecute: "泰铢继续贬值将额外增加¥12万成本",
    factors: [
      { name: "泰铢波动趋势", weight: 55 },
      { name: "本地采购占比32%", weight: 45 }
    ],
    historicalAccuracy: { total: 3, correct: 2, rate: 0.67 },
    status: "pending"
  }
];

// AI建议统计
export const AI_STATS = {
  total: 14,
  budget: 847,
  urgent: 3,
  confirmed: 0
};

// 打字机动画文本
export const TYPEWRITER_TEXTS = {
  forecast: `本次预测综合了4个信号：①IKEA圣诞采购订单同比增长28%（已确认采购函），权重41%；②欧美家具市场电动化渗透率持续提升，环比+6.2%，权重27%；③HJ-LA23历史圣诞季峰值规律（过去3年均在Q4出现1.8-2.3倍增幅），权重19%；④竞品德国Linak交货期延长至14周导致需求转移，权重13%。综合判断：计划员当前预测将导致 ¥2,180万 的圣诞订单无法按时交付。`
};
