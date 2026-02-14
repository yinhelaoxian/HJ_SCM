-- 版本管理DDL
CREATE TABLE demand_versions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20),  -- FORECAST/MONTHLY/SNAPSHOT
    status VARCHAR(20),  -- DRAFT/PENDING/APPROVED
    forecast_data JSONB,
    created_by VARCHAR(36),
    created_at TIMESTAMP,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP,
    rollback_from VARCHAR(36),
    UNIQUE(code)
);

CREATE INDEX idx_versions_type ON demand_versions(type);
CREATE INDEX idx_versions_status ON demand_versions(status);
