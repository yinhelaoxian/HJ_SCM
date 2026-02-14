// 前端 API 服务层
// 所有前端 API 调用都通过此层

const API_BASE = '/api';

// API 响应类型定义
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// MRP 相关 API
export const mrpApi = {
  // 执行 MRP 运算
  async runMrp(params: {
    runMode: 'FORECAST' | 'ORDER' | 'FULL';
    planFromDate: string;
    planToDate: string;
    plantCode: string;
  }): Promise<ApiResponse<MrpRunResponse>> {
    const response = await fetch(`${API_BASE}/mrp/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 查询物料需求
  async getRequirements(params: {
    materialCode?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<MrpRequirement[]>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/mrp/requirements?${query}`);
    return response.json();
  },

  // 齐套检查
  async checkKit(params: {
    requirementIds: string[];
  }): Promise<ApiResponse<KitCheckResult>> {
    const response = await fetch(`${API_BASE}/mrp/kit-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 获取采购建议
  async getSuggestions(): Promise<ApiResponse<ProcurementSuggestion[]>> {
    const response = await fetch(`${API_BASE}/mrp/suggestions`);
    return response.json();
  },

  // BOM 展开
  async explodeBom(params: {
    materialCode: string;
    quantity: number;
    level?: number;
  }): Promise<ApiResponse<MrpRequirement[]>> {
    const response = await fetch(`${API_BASE}/mrp/bom/explode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },
};

// Trace ID 相关 API
export const traceApi = {
  // 正向追溯
  async traceForward(traceId: string): Promise<ApiResponse<TraceNode[]>> {
    const response = await fetch(`${API_BASE}/trace/${traceId}/forward`);
    return response.json();
  },

  // 反向追溯
  async traceBackward(traceId: string): Promise<ApiResponse<TraceNode[]>> {
    const response = await fetch(`${API_BASE}/trace/${traceId}/backward`);
    return response.json();
  },

  // 全链路追溯
  async traceFull(traceId: string): Promise<ApiResponse<TraceNode[]>> {
    const response = await fetch(`${API_BASE}/trace/${traceId}/full`);
    return response.json();
  },

  // 批次追溯
  async traceByBatch(batchNo: string): Promise<ApiResponse<TraceNode[]>> {
    const response = await fetch(`${API_BASE}/trace/batch/${batchNo}`);
    return response.json();
  },

  // 变更影响分析
  async analyzeChangeImpact(params: {
    documentType: string;
    documentId: string;
    newValue: number;
  }): Promise<ApiResponse<ChangeImpactAnalysis>> {
    const response = await fetch(`${API_BASE}/trace/impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },
};

// 库存相关 API
export const inventoryApi = {
  // 查询库存余额
  async getBalances(params: {
    materialCode?: string;
    plantCode: string;
    warehouseCode?: string;
  }): Promise<ApiResponse<InventoryBalance[]>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/inventory/balances?${query}`);
    return response.json();
  },

  // ATP 计算
  async calculateATP(params: {
    materialCode: string;
    requestedQty: number;
    requestedDate: string;
  }): Promise<ApiResponse<ATPResult>> {
    const response = await fetch(`${API_BASE}/inventory/atp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 安全库存计算
  async calculateSafetyStock(params: {
    materialCode: string;
    serviceLevel?: number;
  }): Promise<ApiResponse<{ safetyStock: number }>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/inventory/safety-stock?${query}`);
    return response.json();
  },

  // ABC-XYZ 分类
  async classifyABCXYZ(materialCodes: string[]): Promise<ApiResponse<MaterialClassification[]>> {
    const response = await fetch(`${API_BASE}/inventory/abc-xyz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialCodes),
    });
    return response.json();
  },

  // 呆滞检测
  async detectStagnation(plantCode: string): Promise<ApiResponse<StagnationResult[]>> {
    const response = await fetch(`${API_BASE}/inventory/stagnation?plantCode=${plantCode}`);
    return response.json();
  },
};

// 生产执行 API
export const productionApi = {
  // 获取工单列表
  async getWorkOrders(params?: {
    plantCode?: string;
    status?: string;
  }): Promise<ApiResponse<WorkOrder[]>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/production/orders?${query}`);
    return response.json();
  },

  // 汇报完工
  async reportCompletion(params: {
    orderId: string;
    completedQty: number;
    completedDate: string;
  }): Promise<ApiResponse<{ status: string }>> {
    const response = await fetch(`${API_BASE}/production/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 汇报投料
  async reportIssue(params: {
    orderId: string;
    materialCode: string;
    issueQty: number;
    batchNo?: string;
  }): Promise<ApiResponse<{ status: string }>> {
    const response = await fetch(`${API_BASE}/production/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 批次追溯
  async traceProduction(batchNo: string): Promise<ApiResponse<TraceNode[]>> {
    const response = await fetch(`${API_BASE}/production/trace/${batchNo}`);
    return response.json();
  },
};

// 供应商门户 API
export const supplierApi = {
  // 获取待确认订单
  async getPendingOrders(supplierCode: string): Promise<ApiResponse<OrderDTO[]>> {
    const response = await fetch(`${API_BASE}/supplier-portal/orders/pending?supplierCode=${supplierCode}`);
    return response.json();
  },

  // 确认订单
  async confirmOrder(params: {
    orderId: string;
    confirmedQty: number;
    confirmedDate: string;
  }): Promise<ApiResponse<{ status: string }>> {
    const response = await fetch(`${API_BASE}/supplier-portal/orders/${params.orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 创建 ASN
  async createASN(params: {
    orderId: string;
    logisticsProvider: string;
    trackingNo: string;
    shipmentDate: string;
  }): Promise<ApiResponse<{ asnId: string }>> {
    const response = await fetch(`${API_BASE}/supplier-portal/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // 上传 COA
  async uploadCOA(params: {
    orderId: string;
    batchNo: string;
    file: File;
  }): Promise<ApiResponse<{ coaId: string }>> {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('orderId', params.orderId);
    formData.append('batchNo', params.batchNo);
    
    const response = await fetch(`${API_BASE}/supplier-portal/coa/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // 获取绩效看板
  async getScorecard(supplierCode: string): Promise<ApiResponse<SupplierScore>> {
    const response = await fetch(`${API_BASE}/supplier-portal/score/${supplierCode}`);
    return response.json();
  },
};

// 物流追踪 API
export const logisticsApi = {
  // 获取在途列表
  async getInTransit(params?: {
    logisticsProvider?: string;
    status?: string;
  }): Promise<ApiResponse<InTransitDTO[]>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/logistics/in-transit?${query}`);
    return response.json();
  },

  // 获取物流轨迹
  async getTracking(trackingNo: string): Promise<ApiResponse<TrackingDetailDTO>> {
    const response = await fetch(`${API_BASE}/logistics/tracking/${trackingNo}`);
    return response.json();
  },
};

// 异常告警 API
export const alertApi = {
  // 获取异常列表
  async getExceptions(params?: {
    status?: string;
    urgency?: string;
  }): Promise<ApiResponse<ExceptionItem[]>> {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/alerts/exceptions?${query}`);
    return response.json();
  },

  // 处理异常
  async handleException(params: {
    exceptionId: string;
    action: string;
    remark?: string;
  }): Promise<ApiResponse<{ status: string }>> {
    const response = await fetch(`${API_BASE}/alerts/exceptions/${params.exceptionId}/handle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },
};

export default {
  mrp: mrpApi,
  trace: traceApi,
  inventory: inventoryApi,
  production: productionApi,
  supplier: supplierApi,
  logistics: logisticsApi,
  alert: alertApi,
};
