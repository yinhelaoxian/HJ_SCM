// API 响应类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// MRP 相关类型 - 使用更宽松的定义
export interface MrpRunResponse {
  runId?: string;
  status?: 'COMPLETED' | 'FAILED' | 'PARTIAL';
  durationMs?: number;
  requirementCount?: number;
  shortageCount?: number;
  suggestionCount?: number;
  warnings?: string[];
  errorMessage?: string;
  createdAt?: string;
  // 允许其他属性
  [key: string]: any;
}

export interface MrpRequirement {
  itemCode: string;
  itemName?: string;
  requiredQty: number;
  uom?: string;
  level?: number;
  itemCategory?: string;
  sourceType?: string;
  leadTime?: number;
  safetyStock?: number;
  traceId?: string;
  [key: string]: any;
}

export interface KitCheckResult {
  checkDate?: string;
  kitItems?: KitItem[];
  shortages?: KitShortage[];
  overallFillRate?: number;
  [key: string]: any;
}

export interface KitItem {
  itemCode: string;
  requiredQty?: number;
  availableQty?: number;
  fillRate?: number;
  [key: string]: any;
}

export interface KitShortage {
  itemCode: string;
  requiredQty?: number;
  availableQty?: number;
  shortageQty?: number;
  fillRate?: number;
  urgencyLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredDate?: string;
  traceId?: string;
  [key: string]: any;
}

export interface ProcurementSuggestion {
  itemCode: string;
  itemName?: string;
  suggestedQty?: number;
  suggestedDate?: string;
  supplierCode?: string;
  supplierName?: string;
  estimatedPrice?: number;
  urgencyLevel?: string;
  reason?: string;
  traceId?: string;
  [key: string]: any;
}

// Trace 相关类型
export interface TraceNode {
  traceId?: string;
  documentType?: string;
  documentId?: string;
  version?: number;
  materialCode?: string;
  batchNo?: string;
  quantity?: number;
  documentDate?: string;
  plantCode?: string;
  status?: string;
  children?: TraceNode[];
  [key: string]: any;
}

export interface ChangeImpactAnalysis {
  sourceDocument?: string;
  sourceTraceId?: string;
  oldQuantity?: number;
  newQuantity?: number;
  quantityChange?: number;
  affectedDownstream?: TraceNode[];
  affectedPurchaseOrders?: TraceNode[];
  affectedManufacturingOrders?: TraceNode[];
  impactLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
  medicalImpact?: boolean;
  status?: string;
  message?: string;
  [key: string]: any;
}

// 库存相关类型
export interface InventoryBalance {
  id?: string;
  materialCode: string;
  materialName?: string;
  plantCode: string;
  warehouseCode?: string;
  onHandQty?: number;
  reservedQty?: number;
  availableQty?: number;
  inTransitQty?: number;
  safetyStock?: number;
  oldestBatchDate?: string;
  batchCount?: number;
  [key: string]: any;
}

export interface ATPResult {
  materialCode: string;
  requestedQty?: number;
  requestedDate?: string;
  availableQty?: number;
  inTransitQty?: number;
  atpQty?: number;
  canFulfill?: boolean;
  promisedDate?: string;
  [key: string]: any;
}

export interface MaterialClassification {
  materialCode: string;
  abcClass?: 'A' | 'B' | 'C';
  xyzClass?: 'X' | 'Y' | 'Z';
  combinedClass?: 'HIGH' | 'MEDIUM' | 'LOW';
  annualValue?: number;
  classifiedAt?: string;
  [key: string]: any;
}

export interface StagnationResult {
  materialCode: string;
  plantCode?: string;
  checkDate?: string;
  daysInStock?: number;
  turnoverRate?: number;
  daysNoMovement?: number;
  riskScore?: number;
  riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendations?: string[];
  [key: string]: any;
}

// 生产相关类型
export interface WorkOrder {
  orderId: string;
  materialCode: string;
  materialName?: string;
  quantity?: number;
  planStartDate?: string;
  planEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plantCode: string;
  workstationCode?: string;
  [key: string]: any;
}

// 供应商门户类型
export interface OrderDTO {
  orderId: string;
  supplierCode: string;
  supplierName?: string;
  orderDate?: string;
  deliveryDate?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  items?: OrderItemDTO[];
  totalAmount?: number;
  [key: string]: any;
}

export interface OrderItemDTO {
  itemCode: string;
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
  confirmedQty?: number;
  [key: string]: any;
}

export interface SupplierScore {
  supplierCode: string;
  overallScore?: number;
  otdScore?: number;
  qualityScore?: number;
  priceScore?: number;
  serviceScore?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  lastUpdate?: string;
  [key: string]: any;
}

// 物流相关类型
export interface InTransitDTO {
  trackingNo: string;
  logisticsProvider?: string;
  materialCode: string;
  materialName?: string;
  quantity?: number;
  shippedDate?: string;
  estimatedArrivalDate?: string;
  currentStatus?: string;
  currentLocation?: string;
  [key: string]: any;
}

export interface TrackingDetailDTO {
  trackingNo: string;
  logisticsProvider?: string;
  shippedDate?: string;
  estimatedArrival?: string;
  currentStatus?: string;
  currentLocation?: string;
  events?: TrackingEvent[];
  [key: string]: any;
}

export interface TrackingEvent {
  eventTime?: string;
  eventLocation?: string;
  eventDescription?: string;
  status?: string;
  [key: string]: any;
}

// 异常相关类型
export interface ExceptionItem {
  exceptionId: string;
  exceptionType?: 'SHORTAGE' | 'DELAY' | 'QUALITY' | 'CAPACITY';
  title?: string;
  materialCode?: string;
  materialName?: string;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt?: string;
  slaDeadline?: string;
  assignedTo?: string;
  impact?: string;
  [key: string]: any;
}
