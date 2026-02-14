package com.hjscm.service;

import com.hjscm.entity.TraceRelation;
import com.hjscm.repository.TraceRelationRepository;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Trace ID 服务 - Single Source of Truth
 * 全链路追溯与变更影响分析
 * 
 * 功能：
 * - Trace ID生成
 * - 正向追溯（来源追踪）
 * - 反向追溯（影响分析）
 * - 变更影响分析
 */
@Service
public class TraceIdService {

    @Autowired
    private TraceRelationRepository traceRelationRepository;

    /**
     * 生成Trace ID - 每次单据创建时调用
     * 
     * @param documentType 单据类型 (SO/PO/MO/GR/DN)
     * @param documentId 单据ID
     * @param parentTraceId 父单据Trace ID（可选）
     * @return Trace关系实体
     */
    @Transactional
    public TraceRelation generateTraceId(
            String documentType,
            String documentId,
            String parentTraceId) {
        
        // 检查是否已存在
        Optional<TraceRelation> existing = 
            traceRelationRepository.findByDocumentTypeAndDocumentId(
                documentType, documentId
            );
        
        if (existing.isPresent()) {
            return existing.get();  // 已存在，返回已有
        }
        
        // 创建新Trace ID
        String traceId = UUID.randomUUID().toString();
        String relationType = parentTraceId == null ? "ROOT" : "DERIVED_FROM";
        
        TraceRelation relation = TraceRelation.builder()
            .traceId(traceId)
            .documentType(documentType)
            .documentId(documentId)
            .parentTraceId(parentTraceId)
            .relationType(relationType)
            .createdAt(LocalDateTime.now())
            .build();
        
        // 如果有父节点，添加子节点引用
        if (parentTraceId != null) {
            traceRelationRepository.findById(parentTraceId).ifPresent(parent -> {
                String children = parent.getChildTraceIds();
                Set<String> childSet = children != null 
                    ? new HashSet<>(Arrays.asList(children.split(",")) 
                    : new HashSet<>();
                childSet.add(traceId);
                parent.setChildTraceIds(String.join(",", childSet));
                traceRelationRepository.save(parent);
            });
        }
        
        // 医养物料标记
        if (isMedicalDocument(documentType)) {
            relation.setSensitiveFlag(true);
        }
        
        return traceRelationRepository.save(relation);
    }

    /**
     * 正向追溯 - 查找来源（上游）
     * Exception-Driven: 支持追溯中断检测
     * 
     * @param traceId Trace ID
     * @return 追溯结果
     */
    public TraceResult traceForward(String traceId) {
        List<TraceRelation> chain = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        String currentId = traceId;
        boolean complete = true;
        String breakagePoint = null;
        
        while (currentId != null) {
            if (visited.contains(currentId)) {
                break;  // 环检测
            }
            visited.add(currentId);
            
            Optional<TraceRelation> relation = 
                traceRelationRepository.findById(currentId);
            
            if (relation.isEmpty()) {
                complete = false;
                breakagePoint = currentId;
                break;
            }
            
            chain.add(relation.get());
            currentId = relation.get().getParentTraceId();
        }
        
        return TraceResult.builder()
            .traceChain(chain)
            .complete(complete)
            .breakagePoint(breakagePoint)
            .build();
    }

    /**
     * 反向追溯 - 查找影响（下游）
     * 医养追溯: 敏感物料标记
     * 
     * @param traceId Trace ID
     * @return 追溯结果
     */
    public TraceResult traceBackward(String traceId) {
        List<TraceRelation> chain = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.add(traceId);
        boolean medicalSensitive = false;
        
        while (!queue.isEmpty()) {
            String currentId = queue.poll();
            
            if (currentId == null || visited.contains(currentId)) {
                continue;
            }
            visited.add(currentId);
            
            Optional<TraceRelation> relation = 
                traceRelationRepository.findById(currentId);
            
            if (relation.isEmpty()) continue;
            
            TraceRelation r = relation.get();
            chain.add(r);
            
            // 医养敏感检测
            if (Boolean.TRUE.equals(r.getSensitiveFlag()) || 
                isMedicalDocument(r.getDocumentType())) {
                medicalSensitive = true;
                r.setSensitiveFlag(true);
            }
            
            // 解析子节点
            if (r.getChildTraceIds() != null && !r.getChildTraceIds().isEmpty()) {
                queue.addAll(Arrays.asList(r.getChildTraceIds().split(",")));
            }
            
            // 查询数据库中的子节点
            List<TraceRelation> children = 
                traceRelationRepository.findByParentTraceId(currentId);
            children.forEach(child -> {
                if (!visited.contains(child.getTraceId())) {
                    queue.add(child.getTraceId());
                }
            });
        }
        
        return TraceResult.builder()
            .traceChain(chain)
            .complete(true)
            .medicalSensitive(medicalSensitive)
            .build();
    }

    /**
     * 变更影响分析 - Exception-Driven
     * 
     * @param documentType 单据类型
     * @param documentId 单据ID
     * @return 影响分析结果
     */
    public ImpactAnalysis analyzeImpact(
            String documentType, 
            String documentId) {
        
        // 获取该单据的Trace ID
        Optional<TraceRelation> relation = 
            traceRelationRepository.findByDocument(documentType, documentId);
        
        if (relation.isEmpty()) {
            return ImpactAnalysis.builder()
                .sourceDocument(documentType + ":" + documentId)
                .impactLevel("UNKNOWN")
                .message("未找到Trace ID")
                .build();
        }
        
        String traceId = relation.get().getTraceId();
        
        // 追溯影响范围
        TraceResult forward = traceForward(traceId);
        TraceResult backward = traceBackward(traceId);
        
        // 计算影响级别
        String impactLevel = calculateImpactLevel(backward);
        
        return ImpactAnalysis.builder()
            .sourceDocument(documentType + ":" + documentId)
            .sourceTraceId(traceId)
            .affectedBy(forward.getTraceChain())    // 受影响的上游
            .affects(backward.getTraceChain())     // 影响的下游
            .impactLevel(impactLevel)
            .medicalImpact(backward.isMedicalSensitive())
            .recommendations(generateRecommendations(backward))
            .build();
    }

    /**
     * 根据documentId查询Trace ID
     */
    public String getTraceIdByDocument(String documentType, String documentId) {
        return traceRelationRepository
            .findByDocument(documentType, documentId)
            .map(TraceRelation::getTraceId)
            .orElse(null);
    }

    /**
     * 判断是否为医养单据类型
     */
    private boolean isMedicalDocument(String documentType) {
        // 可以根据业务规则判断
        return documentType != null && 
            (documentType.equals("GR") || documentType.equals("MO"));
    }

    /**
     * 计算影响级别
     */
    private String calculateImpactLevel(TraceResult backward) {
        int count = backward.getTraceChain().size();
        if (count > 20) return "CRITICAL";
        if (count > 10) return "HIGH";
        if (count > 5) return "MEDIUM";
        return "LOW";
    }

    /**
     * 生成影响分析建议
     */
    private List<String> generateRecommendations(TraceResult backward) {
        List<String> recommendations = new ArrayList<>();
        
        if (backward.isMedicalSensitive()) {
            recommendations.add("涉及医养物料，需人工确认");
        }
        
        int count = backward.getTraceChain().size();
        if (count > 10) {
            recommendations.add("影响范围大，建议分批处理");
        }
        
        recommendations.add("建议先处理关键路径上的单据");
        
        return recommendations;
    }
}

    // === 辅助方法 ===

    /**
     * 生成 MRP 运行 Trace ID
     */
    public String generateRunTraceId() {
        return "MRP-RUN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * 生成需求 Trace ID
     */
    public String generateRequirementTraceId(String materialCode) {
        return "MRP-REQ-" + materialCode + "-" + 
            UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    /**
     * 生成建议 Trace ID
     */
    public String generateSuggestionTraceId(String materialCode) {
        return "MRP-SUG-" + materialCode + "-" + 
            UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    /**
     * 变更影响分析 - 带数量对比
     */
    public ChangeImpactAnalysis analyzeChangeImpact(
            String documentType, 
            String documentId, 
            BigDecimal oldQty,
            BigDecimal newQty) {
        
        Optional<TraceRelation> relation = 
            traceRelationRepository.findByDocument(documentType, documentId);
        
        if (relation.isEmpty()) {
            return ChangeImpactAnalysis.builder()
                .sourceDocument(documentType + ":" + documentId)
                .status("NOT_FOUND")
                .message("未找到 Trace ID")
                .build();
        }
        
        String traceId = relation.get().getTraceId();
        TraceResult backward = traceBackward(traceId);
        BigDecimal qtyChange = newQty.subtract(oldQty);
        
        ChangeImpactAnalysis analysis = ChangeImpactAnalysis.builder()
            .sourceDocument(documentType + ":" + documentId)
            .sourceTraceId(traceId)
            .oldQuantity(oldQty)
            .newQuantity(newQty)
            .quantityChange(qtyChange)
            .affectedDownstream(backward.getTraceChain())
            .status("ANALYZED")
            .build();
        
        if (qtyChange.abs().compareTo(oldQty.multiply(BigDecimal.valueOf(0.1))) > 0) {
            analysis.setImpactLevel("HIGH");
            analysis.setRecommendation("变更超过10%，建议重新运行 MRP");
        } else {
            analysis.setImpactLevel("LOW");
        }
        
        return analysis;
    }

    /**
     * 获取根节点 Trace ID
     */
    public String getRootTraceId(String traceId) {
        TraceResult forward = traceForward(traceId);
        if (forward.getTraceChain().isEmpty()) {
            return traceId;
        }
        return forward.getTraceChain().stream()
            .filter(t -> "ROOT".equals(t.getRelationType()))
            .findFirst()
            .map(TraceRelation::getTraceId)
            .orElse(traceId);
    }

    /**
     * 批次追溯查询
     */
    public BatchTraceResult traceByBatch(String batchNo) {
        List<TraceRelation> traces = traceRelationRepository.findByBatchNo(batchNo);
        traces.sort(Comparator.comparing(TraceRelation::getCreatedAt));
        
        return BatchTraceResult.builder()
            .batchNo(batchNo)
            .traceChain(traces)
            .build();
    }
}
