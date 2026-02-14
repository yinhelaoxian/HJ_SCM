package com.hjscm.service;

import com.hjscm.entity.TraceIdEntity;
import com.hjscm.repository.TraceIdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

/**
 * Trace ID 服务
 * 核心职责：生成和管理全链路追溯标识
 */
@Service
public class TraceIdService {

    @Autowired
    private TraceIdRepository traceIdRepository;

    public TraceIdEntity generateTraceId(
            String documentType,
            String documentId,
            String parentTraceId) {
        
        TraceIdEntity traceId = new TraceIdEntity();
        traceId.setTraceId(UUID.randomUUID().toString());
        traceId.setDocumentType(documentType);
        traceId.setDocumentId(documentId);
        traceId.setParentTraceId(parentTraceId);
        traceId.setRelationType(
            parentTraceId == null ? "ROOT" : "DERIVED_FROM"
        );
        traceId.setCreatedAt(java.time.LocalDateTime.now());
        
        return traceIdRepository.save(traceId);
    }

    /**
     * 正向追溯：查询上游来源
     */
    public List<TraceIdEntity> traceForward(String traceId) {
        return traceIdRepository.findByParentTraceId(traceId);
    }

    /**
     * 反向追溯：查询下游影响
     */
    public List<TraceIdEntity> traceBackward(String traceId) {
        return traceIdRepository.findByTraceId(traceId);
    }
}
