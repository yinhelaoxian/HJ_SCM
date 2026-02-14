# HJ_SCM 设计系统 v2.0

**版本**: v2.0  
**更新日期**: 2026-02-14  
**适用范围**: HJ_SCM 前端组件库  

---

## 1. 新增组件

### 1.1 ExceptionPriorityTag 异常优先级标签

**用途**: 异常监控工作台中展示异常优先级

```tsx
interface ExceptionPriorityTagProps {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  showScore?: boolean;
}

// 使用示例
<ExceptionPriorityTag level="HIGH" score={95} showScore />
```

**样式规范**：

| Level | 背景色 | 文字色 | 边框色 | 含义 |
|-------|--------|--------|--------|------|
| HIGH | #FEE2E2 | #DC2626 | #FCA5A5 | 高优先级 |
| MEDIUM | #FEF3C7 | #D97706 | #FCD34D | 中优先级 |
| LOW | #D1FAE5 | #059669 | #6EE7B7 | 低优先级 |

### 1.2 ToastFeedback 全局反馈

**用途**: 全局操作结果反馈

```tsx
// Toast 配置规则
const toastConfig = {
  success: { duration: 3000, icon: CheckCircle },
  warning: { duration: 5000, icon: AlertTriangle },
  error: { duration: 0, icon: XCircle },
  info: { duration: 3000, icon: Info }
};
```

| 操作类型 | Toast类型 | 持续时间 | 示例 |
|----------|-----------|----------|------|
| 成功 | success | 3秒 | 保存成功 |
| 警告 | warning | 5秒 | 数据已过期 |
| 错误 | error | 永久 | 保存失败 |
| 信息 | info | 3秒 | 操作提示 |

### 1.3 SupplyChainMap 供应链地图

**用途**: 供需平衡可视化展示

### 1.4 TraceLinkGraph 追溯链路图

**用途**: Trace查询页面展示追溯关系

---

## 2. 交互规范更新

### 2.1 页面加载状态

| 场景 | 展示方式 |
|------|----------|
| <200ms | 无感知 |
| 200ms-1s | Skeleton 骨架屏 |
| 1s-3s | 进度条 |
| >3s | Loading + 提示 |

### 2.2 异常处理规则

| 异常类型 | 处理方式 |
|----------|----------|
| 网络超时 | 重试 3 次后提示 |
| 权限不足 | 跳转授权页 |
| 业务校验失败 | 显示具体错误 |
| 系统错误 | 降级提示 + 日志 |

---

## 3. 组件命名规范

| 组件名 | 说明 | 路径 |
|--------|------|------|
| ExceptionPriorityTag | 异常优先级标签 | /components/Exception |
| ToastFeedback | 全局反馈 | /components/Feedback |
| SupplyChainMap | 供应链地图 | /components/Visualization |
| TraceLinkGraph | 追溯链路图 | /components/Trace |

---

**文档维护**: 前端工程师  
**当前版本**: v2.0  
**更新日期**: 2026-02-14
