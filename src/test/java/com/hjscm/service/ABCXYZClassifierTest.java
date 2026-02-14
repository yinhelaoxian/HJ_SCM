package com.hjscm.service;

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
 * ABC-XYZ Classifier 单元测试
 */
@ExtendWith(MockitoExtension.class)
class ABCXYZClassifierTest {

    @Mock
    private InventoryBalanceRepository balanceRepository;

    @Mock
    private MonthlyDemandRepository demandRepository;

    @InjectMocks
    private ABCXYZClassifier classifier;

    @Test
    void testClassify_TwoMaterials() {
        // Given
        List<String> materialCodes = Arrays.asList("HJ-LA23", "HJ-LA15");

        when(balanceRepository.findByMaterialCodeIn(materialCodes))
            .thenReturn(Arrays.asList(
                InventoryBalance.builder()
                    .materialCode("HJ-LA23")
                    .annualValue(BigDecimal.valueOf(1000000))
                    .build(),
                InventoryBalance.builder()
                    .materialCode("HJ-LA15")
                    .annualValue(BigDecimal.valueOf(500000))
                    .build()
            ));

        when(demandRepository.findByMaterialCodeAndYear(eq("HJ-LA23"), anyInt()))
            .thenReturn(createMonthlyDemands(12, 100));
        when(demandRepository.findByMaterialCodeAndYear(eq("HJ-LA15"), anyInt()))
            .thenReturn(createMonthlyDemands(12, 50));

        // When
        List<ABCXYZClassifier.MaterialClassification> result = classifier.classify(materialCodes);

        // Then
        assertEquals(2, result.size());
        // HJ-LA23 应该被分类为 A 类（金额占比高）
        ABCXYZClassifier.MaterialClassification la23 = result.stream()
            .filter(c -> "HJ-LA23".equals(c.getMaterialCode()))
            .findFirst().orElse(null);
        assertNotNull(la23);
        assertEquals("A", la23.getAbcClass());
    }

    @Test
    void testCalculateCombinedClass_HIGH() {
        // Given
        ABCXYZClassifier.MaterialClassification classification = ABCXYZClassifier.MaterialClassification.builder()
            .materialCode("HJ-LA23")
            .abcClass("A")
            .xyzClass("X")
            .annualValue(BigDecimal.valueOf(1000000))
            .build();

        // When
        String combined = classifier.generateControlStrategy(classification)
            .get("inventoryPolicy");

        // Then
        assertEquals("严格管控", combined);
    }

    private List<MonthlyDemand> createMonthlyDemands(int count, double baseQty) {
        List<MonthlyDemand> demands = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            demands.add(MonthlyDemand.builder()
                .materialCode("TEST")
                .year(2026)
                .month(i)
                .quantity(BigDecimal.valueOf(baseQty + (Math.random() * 20 - 10)))
                .build());
        }
        return demands;
    }
}
