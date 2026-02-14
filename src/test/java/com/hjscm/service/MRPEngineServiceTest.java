package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
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
 * MRP Engine Service 单元测试
 */
@ExtendWith(MockitoExtension.class)
class MrpEngineServiceTest {

    @Mock
    private com.hjscm.repository.MaterialDemandRepository demandRepository;
    @Mock
    private com.hjscm.repository.InventoryBalanceRepository inventoryRepository;
    @Mock
    private com.hjscm.repository.InTransitOrderRepository inTransitRepository;
    @Mock
    private com.hjscm.repository.MRPConstraintRepository constraintRepository;
    @Mock
    private com.hjscm.repository.BomRepository bomRepository;
    @Mock
    private com.hjscm.repository.ProcurementSuggestionRepository procurementRepository;
    
    @InjectMocks
    private MRPEngineService mrpEngine;

    @Test
    void testBomExplosion_OneLevel() {
        // Given
        BomLine bomLine = BomLine.builder()
            .parentItem("HJ-LA23")
            .childItem("HJ-M05")
            .usagePerParent(BigDecimal.ONE)
            .yieldRate(BigDecimal.ONE)
            .build();
        when(bomRepository.findByParentItemAndActive("HJ-LA23", true))
            .thenReturn(List.of(bomLine));
        
        // When
        List<MrpRequirement> result = mrpEngine.explodeBom(
            "HJ-LA23", BigDecimal.valueOf(100), 1);
        
        // Then
        assertEquals(1, result.size());
        assertEquals("HJ-M05", result.get(0).getItemCode());
        assertEquals(0, BigDecimal.valueOf(100).compareTo(result.get(0).getRequiredQty()));
    }

    @Test
    void testBomExplosion_TwoLevels() {
        // Given
        List<BomLine> bomLines = new ArrayList<>();
        bomLines.add(BomLine.builder()
            .parentItem("HJ-LA23")
            .childItem("HJ-M05")
            .usagePerParent(BigDecimal.ONE)
            .yieldRate(BigDecimal.ONE)
            .build());
        bomLines.add(BomLine.builder()
            .parentItem("HJ-M05")
            .childItem("HJ-SP03")
            .usagePerParent(BigDecimal.valueOf(2))
            .yieldRate(BigDecimal.ONE)
            .build());
        
        when(bomRepository.findByParentItemAndActive("HJ-LA23", true))
            .thenReturn(List.of(bomLines.get(0)));
        when(bomRepository.findByParentItemAndActive("HJ-M05", true))
            .thenReturn(List.of(bomLines.get(1)));
        
        // When
        List<MrpRequirement> result = mrpEngine.explodeBom(
            "HJ-LA23", BigDecimal.valueOf(100), 2);
        
        // Then
        assertEquals(1, result.size());
        assertEquals("HJ-SP03", result.get(0).getItemCode());
        assertEquals(0, BigDecimal.valueOf(200).compareTo(result.get(0).getRequiredQty()));
    }

    @Test
    void testNetRequirementCalculation() {
        // Given
        MrpRequirement req = MrpRequirement.builder()
            .itemCode("HJ-M05")
            .requiredQty(BigDecimal.valueOf(100))
            .leadTime(2)
            .build();
        
        when(inventoryRepository.findByMaterialCodeAndAsOfDate(eq("HJ-M05"), any()))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(30))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        when(inventoryRepository.getSafetyStock(eq("HJ-M05")))
            .thenReturn(BigDecimal.valueOf(10));
        
        // When
        List<MrpNetRequirement> result = mrpEngine.explodeBom(
            "HJ-LA23", BigDecimal.valueOf(100), 3);
        result = mrpEngine.calculateNetRequirements(result, LocalDate.now());
        
        // Then
        // Expected net requirement = 100 - 30 - 10 = 60
        MrpNetRequirement netReq = result.stream()
            .filter(r -> "HJ-M05".equals(r.getItemCode()))
            .findFirst()
            .orElse(null);
        
        assertNotNull(netReq);
        assertEquals(0, BigDecimal.valueOf(60).compareTo(netReq.getNetRequirement()));
    }

    @Test
    void testKitAvailability_AllAvailable() {
        // Given
        MrpNetRequirement req = MrpNetRequirement.builder()
            .itemCode("HJ-LA23")
            .netRequirement(BigDecimal.valueOf(100))
            .traceId("TRACE-001")
            .build();
        
        when(inventoryRepository.findByMaterialCode("HJ-LA23"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(200))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        
        // When
        KitCheckResult result = mrpEngine.checkKitAvailability(List.of(req));
        
        // Then
        assertEquals(1, result.getKitItems().size());
        assertTrue(result.getShortages().isEmpty());
        assertEquals(100.0, result.getOverallFillRate(), 0.01);
    }

    @Test
    void testKitAvailability_WithShortage() {
        // Given
        MrpNetRequirement req = MrpNetRequirement.builder()
            .itemCode("HJ-LA23")
            .netRequirement(BigDecimal.valueOf(200))
            .traceId("TRACE-001")
            .build();
        
        when(inventoryRepository.findByMaterialCode("HJ-LA23"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(100))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        
        // When
        KitCheckResult result = mrpEngine.checkKitAvailability(List.of(req));
        
        // Then
        assertEquals(1, result.getKitItems().size());
        assertEquals(1, result.getShortages().size());
        KitShortage shortage = result.getShortages().get(0);
        assertEquals(0, BigDecimal.valueOf(100).compareTo(shortage.getShortageQty()));
        assertEquals("MEDIUM", shortage.getUrgencyLevel());
    }

    @Test
    void testSafetyStockCalculation() {
        // Given
        when(inventoryRepository.findByMaterialCodeAndAsOfDate(anyString(), any()))
            .thenReturn(Optional.empty());
        when(inventoryRepository.getSafetyStock(anyString()))
            .thenReturn(BigDecimal.valueOf(50));
        
        // When
        BigDecimal ss = mrpEngine.calculateNetRequirements(
            List.of(MrpRequirement.builder()
                .itemCode("HJ-LA23")
                .requiredQty(BigDecimal.valueOf(100))
                .build()),
            LocalDate.now()
        ).get(0).getSafetyStock();
        
        // Then
        assertNotNull(ss);
    }
}
