# GenAI 交互规范与 Prompt 模板

**文档版本**: v1.0  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 平台 AI 交互模块  

---

## 1. 概述

### 1.1 文档目的

本文档定义 HJ_SCM 平台生成式 AI（GenAI）交互规范，包括 Prompt 设计原则、模板库、返回格式标准、置信度标识、人工确认流程等。

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **AI-Augmented** | AI 增强人类决策，非替代 |
| **透明度** | 关键数据显示置信度 |
| **可追溯** | AI 建议可解释、可反馈 |
| **可控性** | 80% 建议需人工确认 |

---

## 2. Prompt 设计规范

### 2.1 Prompt 结构模板

```markdown
## 上下文
{业务场景描述}

## 任务
{具体任务要求}

## 约束条件
- {约束1}
- {约束2}

## 输出格式
{期望的返回结构}

## 示例
{输入输出示例}
```

### 2.2 Prompt 编写原则

| 原则 | 说明 |
|------|------|
| **明确性** | 使用具体术语，避免歧义 |
| **结构性** | 分段清晰，逻辑分明 |
| **可验证** | 提供可验证的输出格式 |
| **上下文完整** | 提供足够背景信息 |

---

## 3. Prompt 模板库

### 3.1 缺料分析场景

```markdown
## 上下文
你是青岛豪江智能的供应链计划分析师，负责分析物料缺料情况并提供解决建议。

## 任务
分析[{时间段}]内的缺料物料，按以下维度排序：
1. 按影响金额排序（降序）
2. 显示TOP5缺料物料
3. 分析每个缺料物料的根本原因

## 约束条件
- 时间范围：{start_date} 至 {end_date}
- 只分析缺料数量>0的物料
- 考虑供应商交期和产能约束

## 输出格式
| 物料编码 | 物料名称 | 缺料数量 | 影响金额 | 原因分析 | 建议措施 |
|---------|----------|----------|----------|----------|----------|

## 示例
输入：分析2026-02-01至2026-02-14的缺料情况
输出：...
```

### 3.2 供应商评估场景

```markdown
## 上下文
你是青岛豪江智能的采购绩效分析师，负责评估供应商综合表现。

## 任务
评估[{供应商名称}]在[{时间段}]的绩效表现，包含：
1. 准时交货率（OTD）
2. 来料质量合格率
3. 响应速度评分
4. 综合绩效得分

## 输出格式
{
  "supplier_id": "xxx",
  "supplier_name": "xxx",
  "period": "xxx",
  "metrics": {
    "otd_rate": 0.95,
    "quality_rate": 0.98,
    "response_score": 4.2,
    "overall_score": 4.5
  },
  "radar_chart_data": {...},
  "improvement_suggestions": [...]
}
```

### 3.3 库存优化场景

```markdown
## 上下文
你是青岛豪江智能的库存管理专家，负责分析库存健康度并提供优化建议。

## 任务
分析[{物料编码}]的库存健康状况：
1. 当前库存天数
2. 周转率分析
3. 呆滞风险预警
4. 库存优化建议

## 输出格式
{
  "material_id": "xxx",
  "health_score": 0-100,
  "days_of_inventory": xxx,
  "turnover_rate": x.x,
  "stagnation_risk": "HIGH/MEDIUM/LOW",
  "recommendations": [...]
}
```

---

## 4. 返回格式规范

### 4.1 标准返回结构

```typescript
interface AIResponse<T> {
  // 核心数据
  data: T;
  
  // 元信息
  metadata: {
    model: string;           // 模型版本
    prompt_version: string;   // Prompt模板版本
    generated_at: Date;      // 生成时间
    query_id: string;        // 查询ID
  };
  
  // 置信度
  confidence: {
    overall: number;         // 总体置信度 0-1
    per_item: Record<string, number>; // 各项置信度
    factors: string[];       // 影响置信度的因素
  };
  
  // 可解释性
  explanation: {
    key_factors: string[];   // 关键影响因素
    assumptions: string[];  // 假设条件
    limitations: string[];   // 局限性说明
  };
  
  // 操作建议
  actions: {
    suggested: string[];      // 建议操作
    requires_confirmation: boolean; // 是否需要确认
    auto_executable: boolean; // 是否可自动执行
  };
}
```

### 4.2 置信度标识标准

| 置信度 | 标识 | 颜色 | 含义 |
|--------|------|------|------|
| 0.9-1.0 | 🟢 高 | 绿色 | 可信度高，建议可直接采纳 |
| 0.7-0.89 | 🟡 中 | 黄色 | 可信度中等，建议人工确认 |
| 0.5-0.69 | 🟠 低 | 橙色 | 可信度较低，谨慎参考 |
| <0.5 | 🔴 很低 | 红色 | 建议人工分析 |

---

## 5. 人工确认流程

### 5.1 信任阈值配置

| 场景 | 阈值 | 处理方式 |
|------|------|----------|
| 高价值决策（>10万） | 0.9 | 必须人工确认 |
| 中价值决策（1-10万） | 0.7 | 建议人工确认 |
| 低价值决策（<1万） | 0.5 | 可自动执行 |

### 5.2 反馈优化机制

```typescript
interface AIFeedback {
  query_id: string;
  feedback_type: 'ACCEPTED' | 'REJECTED' | 'MODIFIED';
  original_suggestion: string;
  final_decision: string;
  deviation_reason: string;
  improvement_suggestion?: string;
}
```

---

**文档维护**: AI/ML 专家  
**当前版本**: v1.0  
**更新日期**: 2026-02-14
