# Sprint 3 性能优化清单

## API 性能要求

| 场景 | 指标 | 要求 |
|------|------|------|
| 预测API | P95响应 | <500ms |
| 甘特图 | 渲染时间 | <2s |
| 异常列表 | 首屏 | <1s |
| 月份切换 | 切换时间 | <300ms |

## 优化策略

```typescript
// 1. 代码分割
const DemandForecast = lazy(() => import('./DemandForecast'));
const SOPWorkflow = lazy(() => import('./SOPWorkflow'));

// 2. 虚拟滚动
<VirtualList data={items} height={400} itemSize={60}/>

// 3. 缓存策略
const cache = new MapCache();
cache.set(key, data, 5 * 60 * 1000); // 5分钟
```

## 数据库索引

```sql
CREATE INDEX idx_forecast_material ON forecasts(material_id);
CREATE INDEX idx_version_status ON versions(status);
CREATE INDEX idx_exception_priority ON exceptions(priority_score DESC);
```
