package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Trace ID Service 单元测试
 */
@ExtendWith(MockitoExtension.class)
class TraceIdServiceTest {

    @Mock
    private TraceRelationRepository traceRelationRepository;

    @InjectMocks
    private TraceIdService traceService;

    @Test
    void testGenerateTrace_Success() {
        // Given
        when(traceRelationRepository.findByDocumentTypeAndDocumentId("SO", "SO-2026-001"))
            .thenReturn(Optional.empty());
        when(traceRelationRepository.save(any(TraceRelation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        // When
        TraceRelation result = traceService.generateTraceId("SO", "SO-2026-001", null);

        // Then
        assertNotNull(result.getTraceId());
        assertEquals("SO", result.getDocumentType());
        assertEquals("SO-2026-001", result.getDocumentId());
        assertEquals("ROOT", result.getRelationType());
    }

    @Test
    void testGenerateTrace_WithParent() {
        // Given
        when(traceRelationRepository.findByDocumentTypeAndDocumentId("MO", "MO-2026-001"))
            .thenReturn(Optional.empty());
        when(traceRelationRepository.findById("parent-trace-id"))
            .thenReturn(Optional.of(TraceRelation.builder()
                .traceId("parent-trace-id")
                .childTraceIds("")
                .build()));
        when(traceRelationRepository.save(any(TraceRelation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        // When
        TraceRelation result = traceService.generateTraceId("MO", "MO-2026-001", "parent-trace-id");

        // Then
        assertNotNull(result.getTraceId());
        assertEquals("parent-trace-id", result.getParentTraceId());
        assertEquals("DERIVED_FROM", result.getRelationType());
    }

    @Test
    void testGenerateRunTraceId() {
        // When
        String traceId = traceService.generateRunTraceId();

        // Then
        assertNotNull(traceId);
        assertTrue(traceId.startsWith("MRP-RUN-"));
    }

    @Test
    void testGenerateRequirementTraceId() {
        // When
        String traceId = traceService.generateRequirementTraceId("HJ-LA23");

        // Then
        assertNotNull(traceId);
        assertTrue(traceId.contains("HJ-LA23"));
    }

    @Test
    void testAnalyzeChangeImpact_Success() {
        // Given
        when(traceRelationRepository.findByDocument("SO", "SO-2026-001"))
            .thenReturn(Optional.of(TraceRelation.builder()
                .traceId("trace-001")
                .documentType("SO")
                .documentId("SO-2026-001")
                .build()));

        // When
        ChangeImpactAnalysis result = traceService.analyzeChangeImpact(
            "SO", "SO-2026-001", 
            BigDecimal.valueOf(100), BigDecimal.valueOf(150));

        // Then
        assertNotNull(result);
        assertEquals("ANALYZED", result.getStatus());
        assertEquals("HIGH", result.getImpactLevel());
    }

    @Test
    void testAnalyzeChangeImpact_NotFound() {
        // Given
        when(traceRelationRepository.findByDocument("SO", "NOT-FOUND"))
            .thenReturn(Optional.empty());

        // When
        ChangeImpactAnalysis result = traceService.analyzeChangeImpact(
            "SO", "NOT-FOUND", 
            BigDecimal.valueOf(100), BigDecimal.valueOf(150));

        // Then
        assertNotNull(result);
        assertEquals("NOT_FOUND", result.getStatus());
    }
}
