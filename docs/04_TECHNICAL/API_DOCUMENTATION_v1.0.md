# API 接口文档 v1.0

**版本**: v1.0  
**日期**: 2026-02-14  
**适用范围**: HJ_SCM API 文档  

---

## 1. MRP 接口

### 1.1 执行 MRP 运算

**POST** `/api/mrp/run`

**请求体**:
```json
{
  "runMode": "FULL",
  "planFromDate": "2026-02-14",
  "planToDate": "2026-05-14",
  "plantCode": "QINGDAO"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "runId": "MRP-RUN-ABC12345",
    "status": "COMPLETED",
    "durationMs": 15234,
    "requirementCount": 156,
    "shortageCount": 12,
    "suggestionCount": 8,
    "createdAt": "2026-02-14T10:30:00"
  }
}
```

### 1.2 查询物料需求

**GET** `/api/mrp/requirements`

**参数**:
- `materialCode`: 物料编码（可选）
- `fromDate`: 开始日期
- `toDate`: 结束日期

### 1.3 齐套检查

**POST** `/api/mrp/kit-check`

**请求体**:
```json
{
  "requirementIds": ["REQ-001", "REQ-002"]
}
```

---

## 2. Trace 接口

### 2.1 正向追溯

**GET** `/api/trace/{traceId}/forward`

### 2.2 反向追溯

**GET** `/api/trace/{traceId}/backward`

### 2.3 全链路追溯

**GET** `/api/trace/{traceId}/full`

### 2.4 变更影响分析

**POST** `/api/trace/impact`

**请求体**:
```json
{
  "documentType": "SO",
  "documentId": "SO-2026-001",
  "newValue": 150
}
```

---

## 3. 库存接口

### 3.1 查询库存余额

**GET** `/api/inventory/balances`

**参数**:
- `materialCode`: 物料编码
- `plantCode`: 工厂编码

### 3.2 计算 ATP

**POST** `/api/inventory/atp`

**请求体**:
```json
{
  "materialCode": "HJ-LA23",
  "plantCode": "QINGDAO",
  "requestedQty": 2000,
  "requestedDate": "2026-02-20"
}
```

### 3.3 ABC-XYZ 分类

**POST** `/api/inventory/abc-xyz`

**请求体**:
```json
{
  "materialCodes": ["HJ-LA23", "HJ-LA15", "HJ-M05"]
}
```

### 3.4 呆滞检测

**GET** `/api/inventory/stagnation?plantCode=QINGDAO`

---

## 4. 生产接口

### 4.1 查询工单

**GET** `/api/production/orders`

**参数**:
- `plantCode`: 工厂编码
- `status`: 状态

### 4.2 汇报完工

**POST** `/api/production/completion`

**请求体**:
```json
{
  "orderId": "MO-2026-001",
  "completedQty": 500,
  "completedDate": "2026-02-14",
  "qualityStatus": "PASSED"
}
```

### 4.3 汇报投料

**POST** `/api/production/issue`

**请求体**:
```json
{
  "orderId": "MO-2026-001",
  "materialCode": "HJ-M05",
  "issueQty": 500,
  "batchNo": "BATCH-001"
}
```

---

## 5. 供应商门户接口

### 5.1 待确认订单

**GET** `/api/supplier-portal/orders/pending?supplierCode=SUP001`

### 5.2 确认订单

**POST** `/api/supplier-portal/orders/{orderId}/confirm`

### 5.3 创建 ASN

**POST** `/api/supplier-portal/shipments`

### 5.4 上传 COA

**POST** `/api/supplier-portal/coa/upload`

---

## 6. 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待完善
