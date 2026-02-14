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
 * Safety Stock Calculator 单元测试
 */
@ExtendWith(MockitoExtension.class)
class SafetyStockCalculatorTest {

    @Mock
    private SafetyStockConfigRepository configRepository;

    @Mock
    private DailyDemandRepository demandRepository;

    @InjectMocks
    private SafetyStockCalculator calculator;

    @Test
    void testCalculateSafetyStock_95ServiceLevel() {
        // Given
        when(configRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(Optional.of(SafetyStockConfig.builder()
                .materialCode("HJ-LA23")
                .plantCode("QINGDAO")
                .serviceLevel(0.95)
                .leadTimeDays(7)
                .build()));

        List<DailyDemand> history = new ArrayList<>();
        for (int i = 0; i < 90; i++) {
            history.add(DailyDemand.builder()
                .materialCode("HJ-LA23")
                .quantity(BigDecimal.valueOf(100 + (i % 20 - 10)))
                .build());
        }
        when(demandRepository.findByMaterialCodeAndDateAfter(eq("HJ-LA23"), any()))
            .thenReturn(history);

        // When
        BigDecimal result = calculator.calculateSafetyStock("HJ-LA23", "QINGDAO", 0.95);

        // Then
        assertNotNull(result);
        assertTrue(result.compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    void testCalculateSafetyStock_99ServiceLevel() {
        // Given
        when(configRepository.findByMaterialCodeAndPlantCode("HJ-M05", "QINGDAO"))
            .thenReturn(Optional.of(SafetyStockConfig.builder()
                .materialCode("HJ-M05")
                .plantCode("QINGDAO")
                .serviceLevel(0.99)
                .leadTimeDays(14)
                .build()));

        when(demandRepository.findByMaterialCodeAndDateAfter(eq("HJ-M05"), any()))
            .thenReturn(Collections.emptyList());

        // When
        BigDecimal result = calculator.calculateSafetyStock("HJ-M05", "QINGDAO", 0.99);

        // Then
        assertNotNull(result);
        assertTrue(result.compareTo(BigDecimal.ZERO) > 0);
    }
}
