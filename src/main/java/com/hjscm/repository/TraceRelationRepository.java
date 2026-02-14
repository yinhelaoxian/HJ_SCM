package com.hjscm.repository;

import com.hjscm.entity.TraceRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Trace关系Repository
 */
@Repository
public interface TraceRelationRepository extends JpaRepository<TraceRelation, String> {
    
    Optional<TraceRelation> findByDocumentTypeAndDocumentId(
        String documentType, 
        String documentId
    );
    
    List<TraceRelation> findByParentTraceId(String parentTraceId);
    
    @Query("SELECT t FROM TraceRelation t WHERE t.parentTraceId IN :traceIds")
    List<TraceRelation> findByParentTraceIdIn(
        @Param("traceIds") List<String> traceIds
    );
    
    @Query("SELECT t FROM TraceRelation t WHERE t.documentType = :docType AND t.documentId = :docId")
    Optional<TraceRelation> findByDocument(
        @Param("docType") String docType,
        @Param("docId") String docId
    );
}
