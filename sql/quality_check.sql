-- 数据治理DDL
CREATE TABLE quality_logs (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(50),
    entity_id UUID,
    check_type VARCHAR(50),
    issue_type VARCHAR(50),
    issue_message VARCHAR(500),
    severity VARCHAR(20),
    created_at TIMESTAMP
);

CREATE INDEX idx_quality_entity ON quality_logs(entity_type, entity_id);
CREATE INDEX idx_quality_severity ON quality_logs(severity);

COMMENT ON TABLE quality_logs IS '数据质量检查日志';
