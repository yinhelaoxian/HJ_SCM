-- HJ_SCM 数据库 DDL 脚本
-- 版本: v1.0
-- 日期: 2026-02-14
-- 用途: Sprint 1 核心表结构

-- ==================== TRACE ID 表 ====================
CREATE TABLE IF NOT EXISTS trace_relations (
    trace_id VARCHAR(36) PRIMARY KEY,
    document_type VARCHAR(10) NOT NULL,
    document_id VARCHAR(50) NOT NULL,
    parent_trace_id VARCHAR(36),
    child_trace_ids TEXT,  -- JSON数组
    relation_type VARCHAR(20),  -- ROOT/DERIVED_FROM/TRIGGERED_BY
    sensitive_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    CONSTRAINT fk_parent_trace FOREIGN KEY (parent_trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_trace_parent ON trace_relations(parent_trace_id);
CREATE INDEX idx_trace_doc ON trace_relations(document_type, document_id);
CREATE INDEX idx_trace_created ON trace_relations(created_at);

COMMENT ON TABLE trace_relations IS 'Trace ID关系表 - 全链路追溯核心表';
COMMENT ON COLUMN trace_relations.sensitive_flag IS '医养敏感标记，true表示需要严格追溯';

-- ==================== 库存批次表 ====================
CREATE TABLE IF NOT EXISTS inventory_batches (
    id VARCHAR(36) PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL,
    material_id VARCHAR(50) NOT NULL,
    warehouse_id VARCHAR(50) NOT NULL,
    location_id VARCHAR(50),
    quantity DECIMAL(18, 6) NOT NULL,
    unit_code VARCHAR(20),
    expiry_date DATE,
    manufacture_date DATE,
    trace_id VARCHAR(36),
    status VARCHAR(20) DEFAULT 'AVAILABLE',  -- AVAILABLE/RESERVED/BLOCKED/EXPIRED
    medical_grade BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    CONSTRAINT fk_batch_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_batch_material ON inventory_batches(material_id);
CREATE INDEX idx_batch_warehouse ON inventory_batches(warehouse_id);
CREATE INDEX idx_batch_batch ON inventory_batches(batch_number);
CREATE INDEX idx_batch_trace ON inventory_batches(trace_id);
CREATE INDEX idx_batch_expiry ON inventory_batches(expiry_date);
CREATE INDEX idx_batch_status ON inventory_batches(status);

COMMENT ON TABLE inventory_batches IS '库存批次表 - 支持批次/LPN/序列号追溯';
COMMENT ON COLUMN inventory_batches.medical_grade IS '医养等级，true表示医养产品需严格追溯';

-- ==================== 库存余额表 ====================
CREATE TABLE IF NOT EXISTS inventory_balances (
    id VARCHAR(36) PRIMARY KEY,
    material_id VARCHAR(50) NOT NULL,
    warehouse_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(18, 6) NOT NULL,
    reserved_qty DECIMAL(18, 6) DEFAULT 0,
    available_qty DECIMAL(18, 6),
    trace_id VARCHAR(36),
    as_of_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_balance_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_balance_material ON inventory_balances(material_id);
CREATE INDEX idx_balance_warehouse ON inventory_balances(warehouse_id);
CREATE INDEX idx_balance_date ON inventory_balances(as_of_date);
CREATE UNIQUE INDEX idx_balance_unique ON inventory_balances(material_id, warehouse_id, as_of_date);

COMMENT ON TABLE inventory_balances IS '库存余额表 - 多级库存视图数据源';

-- ==================== MRP 约束表 ====================
CREATE TABLE IF NOT EXISTS mrp_constraints (
    id VARCHAR(36) PRIMARY KEY,
    material_id VARCHAR(50) NOT NULL UNIQUE,
    moq INTEGER,                   -- 最小起订量
    batch_size INTEGER,             -- 批量大小
    lead_time INTEGER,              -- 交期(天)
    pack_unit INTEGER,              -- 包装单位
    preferred_supplier_id VARCHAR(50),  -- 首选供应商
    alternative_material_id VARCHAR(50),  -- 替代物料
    batch_tracking_required BOOLEAN DEFAULT FALSE,  -- 是否需要批次追踪
    medical_grade BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_constraint_material ON mrp_constraints(material_id);
CREATE INDEX idx_constraint_supplier ON mrp_constraints(preferred_supplier_id);

COMMENT ON TABLE mrp_constraints IS 'MRP约束配置表 - 约束优化规则';

-- ==================== 销售订单表 ====================
CREATE TABLE IF NOT EXISTS sales_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    trace_id VARCHAR(36),
    total_amount DECIMAL(18, 2),
    currency VARCHAR(10) DEFAULT 'CNY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_so_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_so_customer ON sales_orders(customer_id);
CREATE INDEX idx_so_status ON sales_orders(status);
CREATE INDEX idx_so_created ON sales_orders(created_at);

COMMENT ON TABLE sales_orders IS '销售订单表 - SO状态机主表';

-- ==================== 销售订单明细表 ====================
CREATE TABLE IF NOT EXISTS sales_order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    material_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(18, 6) NOT NULL,
    unit_code VARCHAR(20),
    unit_price DECIMAL(18, 4),
    trace_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_soi_order FOREIGN KEY (order_id) 
        REFERENCES sales_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_soi_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_soi_order ON sales_order_items(order_id);
CREATE INDEX idx_soi_material ON sales_order_items(material_id);

COMMENT ON TABLE sales_order_items IS '销售订单明细表 - 订单物料明细';

-- ==================== 采购订单表 ====================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    trace_id VARCHAR(36),
    total_amount DECIMAL(18, 2),
    currency VARCHAR(10) DEFAULT 'CNY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_po_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);

COMMENT ON TABLE purchase_orders IS '采购订单表 - PO状态机主表';

-- ==================== 采购订单明细表 ====================
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    material_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(18, 6) NOT NULL,
    unit_code VARCHAR(20),
    unit_price DECIMAL(18, 4),
    confirmed_qty DECIMAL(18, 6),
    trace_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_poi_order FOREIGN KEY (order_id) 
        REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_poi_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_poi_order ON purchase_order_items(order_id);
CREATE INDEX idx_poi_material ON purchase_order_items(material_id);

COMMENT ON TABLE purchase_order_items IS '采购订单明细表 - 采购物料明细';

-- ==================== 收货单表 ====================
CREATE TABLE IF NOT EXISTS goods_receipts (
    id VARCHAR(36) PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    po_id VARCHAR(36),
    supplier_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    trace_id VARCHAR(36),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_gr_po FOREIGN KEY (po_id) 
        REFERENCES purchase_orders(id),
    CONSTRAINT fk_gr_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_gr_po ON goods_receipts(po_id);
CREATE INDEX idx_gr_supplier ON goods_receipts(supplier_id);
CREATE INDEX idx_gr_status ON goods_receipts(status);

COMMENT ON TABLE goods_receipts IS '收货单表 - GR状态机主表';

-- ==================== 生产工单表 ====================
CREATE TABLE IF NOT EXISTS manufacturing_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(18, 6) NOT NULL,
    status VARCHAR(20) DEFAULT 'PLANNED',
    trace_id VARCHAR(36),
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_mo_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_mo_product ON manufacturing_orders(product_id);
CREATE INDEX idx_mo_status ON manufacturing_orders(status);
CREATE INDEX idx_mo_planned ON manufacturing_orders(planned_start_date);

COMMENT ON TABLE manufacturing_orders IS '生产工单表 - MO状态机主表';

-- ==================== 交货单表 ====================
CREATE TABLE IF NOT EXISTS delivery_notes (
    id VARCHAR(36) PRIMARY KEY,
    dn_number VARCHAR(50) UNIQUE NOT NULL,
    so_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    trace_id VARCHAR(36),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_dn_so FOREIGN KEY (so_id) 
        REFERENCES sales_orders(id),
    CONSTRAINT fk_dn_trace FOREIGN KEY (trace_id) 
        REFERENCES trace_relations(trace_id)
);

CREATE INDEX idx_dn_so ON delivery_notes(so_id);
CREATE INDEX idx_dn_status ON delivery_notes(status);

COMMENT ON TABLE delivery_notes IS '交货单表 - DN状态机主表';

-- ==================== 事件日志表 ====================
CREATE TABLE IF NOT EXISTS event_logs (
    id VARCHAR(36) PRIMARY KEY,
    event_code VARCHAR(50) NOT NULL,
    document_type VARCHAR(10),
    document_id VARCHAR(36),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    payload TEXT,  -- JSON格式
    user_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_doc ON event_logs(document_type, document_id);
CREATE INDEX idx_event_code ON event_logs(event_code);
CREATE INDEX idx_event_created ON event_logs(created_at);

COMMENT ON TABLE event_logs IS '事件日志表 - 状态变更审计';

-- ==================== 初始化数据 ====================
-- 插入示例约束配置
INSERT INTO mrp_constraints (id, material_id, moq, batch_size, lead_time, preferred_supplier_id, batch_tracking_required, medical_grade)
VALUES 
    ('cstr-001', 'MED-MOTOR-001', 50, 50, 14, 'sup-001', TRUE, TRUE),
    ('cstr-002', 'MED-CONTROL-001', 100, 100, 10, 'sup-002', TRUE, TRUE),
    ('cstr-003', 'STD-FRAME-001', 200, 200, 7, 'sup-003', FALSE, FALSE)
ON CONFLICT (material_id) DO NOTHING;
