-- ============================================
-- MDM 主数据管理数据库Schema
-- 创建时间: 2026-02-15
-- ============================================

-- 物料主数据表
CREATE TABLE IF NOT EXISTS mm_material (
    id BIGSERIAL PRIMARY KEY,
    material_id VARCHAR(50) NOT NULL UNIQUE,
    material_name VARCHAR(200) NOT NULL,
    material_name_en VARCHAR(200),
    material_group VARCHAR(50) NOT NULL,
    material_type VARCHAR(10) NOT NULL,  -- ROH/HALB/FERT
    base_unit VARCHAR(20) NOT NULL,
    
    -- 采购信息
    default_supplier VARCHAR(50),
    procurement_type VARCHAR(10),  -- F/K
    moq INTEGER,
    lead_time INTEGER,
    price_min DECIMAL(15, 2),
    price_max DECIMAL(15, 2),
    
    -- 库存信息
    storage_location VARCHAR(50),
    abc_class VARCHAR(1),
    xyz_class VARCHAR(1),
    safety_stock DECIMAL(15, 2),
    reorder_point DECIMAL(15, 2),
    
    -- 生产信息
    bom_id VARCHAR(50),
    routing_id VARCHAR(50),
    production_batch INTEGER,
    scrap_rate DECIMAL(8, 6),
    
    -- 质量信息
    inspection_type VARCHAR(10),
    shelf_life INTEGER,
    is_serial_number BOOLEAN DEFAULT FALSE,
    is_batch_manage BOOLEAN DEFAULT FALSE,
    
    -- 状态
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    
    -- 审计字段
    created_by VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_time TIMESTAMP,
    
    -- 索引
    CONSTRAINT chk_material_type CHECK (material_type IN ('ROH', 'HALB', 'FERT')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_mm_material_id ON mm_material(material_id);
CREATE INDEX IF NOT EXISTS idx_mm_material_group ON mm_material(material_group);
CREATE INDEX IF NOT EXISTS idx_mm_material_type ON mm_material(material_type);
CREATE INDEX IF NOT EXISTS idx_mm_material_status ON mm_material(status);

-- BOM主表
CREATE TABLE IF NOT EXISTS mm_bom (
    id BIGSERIAL PRIMARY KEY,
    bom_id VARCHAR(50) NOT NULL UNIQUE,
    bom_name VARCHAR(200) NOT NULL,
    material VARCHAR(50) NOT NULL,
    bom_usage DECIMAL(15, 5) DEFAULT 1,
    bom_unit VARCHAR(20),
    bom_level INTEGER NOT NULL,
    validity_start TIMESTAMP,
    validity_end TIMESTAMP,
    alternative_group VARCHAR(50),
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    
    created_by VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_time TIMESTAMP,
    
    CONSTRAINT chk_bom_level CHECK (bom_level >= 1 AND bom_level <= 10),
    CONSTRAINT chk_bom_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_mm_bom_id ON mm_bom(bom_id);
CREATE INDEX IF NOT EXISTS idx_mm_bom_material ON mm_bom(material);
CREATE INDEX IF NOT EXISTS idx_mm_bom_level ON mm_bom(bom_level);

-- BOM子件表
CREATE TABLE IF NOT EXISTS mm_bom_item (
    id BIGSERIAL PRIMARY KEY,
    bom_id VARCHAR(50) NOT NULL,
    component_material VARCHAR(50) NOT NULL,
    component_qty DECIMAL(15, 5) NOT NULL,
    operation_id VARCHAR(50),
    work_center VARCHAR(50),
    scrap_add_rate DECIMAL(8, 6) DEFAULT 0,
    is_phantom BOOLEAN DEFAULT FALSE,
    is_subcontract BOOLEAN DEFAULT FALSE,
    item_sequence INTEGER,
    
    created_by VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mm_bom_item_bom ON mm_bom_item(bom_id);
CREATE INDEX IF NOT EXISTS idx_mm_bom_item_component ON mm_bom_item(component_material);
CREATE INDEX IF NOT EXISTS idx_mm_bom_item_operation ON mm_bom_item(operation_id);

-- 供应商主数据表
CREATE TABLE IF NOT EXISTS mm_supplier (
    id BIGSERIAL PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    supplier_name_en VARCHAR(200),
    supplier_type VARCHAR(50),
    category VARCHAR(50),
    tier_level INTEGER DEFAULT 3,
    
    -- 联系信息
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    address VARCHAR(500),
    
    -- 资质信息
    iso_certified BOOLEAN DEFAULT FALSE,
    quality_rating DECIMAL(3, 2) DEFAULT 0,
    delivery_rating DECIMAL(3, 2) DEFAULT 0,
    price_rating DECIMAL(3, 2) DEFAULT 0,
    
    -- 银行信息
    bank_name VARCHAR(200),
    bank_account VARCHAR(100),
    
    -- 状态
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    
    -- 审计字段
    created_by VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_time TIMESTAMP,
    
    CONSTRAINT chk_supplier_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE INDEX IF NOT EXISTS idx_mm_supplier_id ON mm_supplier(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mm_supplier_type ON mm_supplier(supplier_type);
CREATE INDEX IF NOT EXISTS idx_mm_supplier_category ON mm_supplier(category);
CREATE INDEX IF NOT EXISTS idx_mm_supplier_tier ON mm_supplier(tier_level);

-- ============================================
-- 示例数据
-- ============================================

-- 插入示例物料
INSERT INTO mm_material (material_id, material_name, material_group, material_type, base_unit, 
                        storage_location, abc_class, safety_stock, is_batch_manage, status)
VALUES 
    ('MAT-20260215-001', '电机 A 型', '电机', 'ROH', '个', 'WH01', 'A', 100, TRUE, 'ACTIVE'),
    ('MAT-20260215-002', '轴承 B 型', '轴承', 'ROH', '个', 'WH01', 'A', 200, TRUE, 'ACTIVE'),
    ('MAT-20260215-003', '外壳 C 型', '外壳', 'ROH', '个', 'WH01', 'B', 150, TRUE, 'ACTIVE'),
    ('MAT-20260215-004', '控制器总成', '控制器', 'HALB', '个', 'WH02', 'A', 50, TRUE, 'ACTIVE'),
    ('MAT-20260215-005', '线性驱动装置 LA23', '成品', 'FERT', '套', 'WH03', 'A', 30, TRUE, 'ACTIVE');

-- 插入示例BOM
INSERT INTO mm_bom (bom_id, bom_name, material, bom_usage, bom_unit, bom_level, status)
VALUES 
    ('BOM-20260215-001', 'LA23 BOM', 'MAT-20260215-005', 1, '套', 1, 'ACTIVE');

-- 插入示例BOM子件
INSERT INTO mm_bom_item (bom_id, component_material, component_qty, operation_id, item_sequence)
VALUES 
    ('BOM-20260215-001', 'MAT-20260215-001', 1, 'OP10', 1),
    ('BOM-20260215-001', 'MAT-20260215-002', 2, 'OP10', 2),
    ('BOM-20260215-001', 'MAT-20260215-003', 1, 'OP20', 3),
    ('BOM-20260215-001', 'MAT-20260215-004', 1, 'OP30', 4);

-- 插入示例供应商
INSERT INTO mm_supplier (supplier_id, supplier_name, supplier_type, category, tier_level,
                       contact_person, phone, email, address, quality_rating, delivery_rating, status)
VALUES 
    ('SUP-20260215-001', 'Bühler Motor', '核心供应商', '电机', 1, '张经理', '+86-532-88888888', 'zhang@buhler.cn', '青岛市南区', 4.5, 4.8, 'ACTIVE'),
    ('SUP-20260215-002', '宁波天阁', '一般供应商', '轴承', 2, '李经理', '+86-574-77777777', 'li@tiange.cn', '宁波市', 4.2, 4.5, 'ACTIVE'),
    ('SUP-20260215-003', '苏州联达', '一般供应商', '外壳', 2, '王经理', '+86-512-66666666', 'wang@lianda.cn', '苏州市', 4.0, 4.3, 'ACTIVE');

COMMIT;
