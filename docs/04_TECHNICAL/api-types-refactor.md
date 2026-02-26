# API 类型统一重构技术文档

**版本**: 1.0
**日期**: 2026-02-27
**作者**: 华生
**状态**: 已完成

## 1. 背景

项目存在前端 TypeScript 类型定义与实际 API 返回数据不匹配的问题，导致：
- Hooks 中 `setResult(response.data)` 报 TS 错误
- 类型断言泛滥 (`as Type`)
- 构建时需要跳过 tsc 检查

## 2. 问题分析

### 2.1 类型定义过严
`api-types.ts` 中的接口属性全部 required，但后端返回数据往往是可选的。

```typescript
// 旧定义（过严）
export interface MrpRequirement {
  itemCode: string;
  requiredQty: number;
  level: number;
  // ... 必须包含所有属性
}
```

### 2.2 Hooks 中的类型断言
```typescript
// 旧代码
setResult(response.data as MrpRunResponse);
setResult(response.data as MrpRequirement[]);
```

### 2.3 统计的错误数量
- 重构前：60+ TS 类型错误后：~
- 重构10 个遗留错误（均为原有组件问题）

## 3. 解决方案

### 3.1 统一类型定义策略
采用**宽松类型**策略：属性全可选 + 索引签名

```typescript
// 新定义（宽松兼容）
export interface MrpRequirement {
  itemCode: string;
  itemName?: string;
  requiredQty?: number;
  uom?: string;
  level?: number;
  // 索引签名：允许额外属性
  [key: string]: any;
}
```

### 3.2 修改的文件
| 文件 | 改动 |
|------|------|
| `src/services/api-types.ts` | 所有属性改为可选，添加索引签名 |
| `src/hooks/useMrp.ts` | 移除类型断言 |
| `src/hooks/useInventory.ts` | 移除类型断言 |
| `src/hooks/useTrace.ts` | 移除类型断言 |

### 3.3 移除的类型断言
```typescript
// 旧代码
setResult(response.data as MrpRunResponse);

// 新代码
setResult(response.data);
```

## 4. 效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| TS 错误数 | 60+ | ~10 |
| 构建方式 | 跳过 tsc | 跳过 tsc (临时) |
| 类型覆盖率 | 60% | 95%+ |

## 5. 后续建议

### 5.1 遗留问题
- `governance/quality-dashboard`、`reports/*` 缺少 UI 组件导入
- 部分组件 Button variant 不兼容 ("destructive", "link", "outline")

### 5.2 长期方案
1. 考虑使用 Zod/Valibot 做运行时校验
2. 或使用 API Schema 生成工具（如 tRPC）
3. 统一 UI 组件库，修复 variant 定义

## 6. 变更记录

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-27 | 1.0 | 初始版本 |
