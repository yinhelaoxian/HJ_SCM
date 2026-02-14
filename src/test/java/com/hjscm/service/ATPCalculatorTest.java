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
 * ATP Calculator 单元测试
 */
@ExtendWith(MockitoExtension.class)
class ATPCalculatorTest {

    @Mock
    private InventoryBalanceRepository balanceRepository;

    @Mock
    private InTransitOrderRepository inTransitRepository;

    @Mock
    private SalesOrderRepository salesOrderRepository;

    @Mock
    private MrpReservationRepository reservationRepository;

    @InjectMocks
    private ATPCalculator atpCalculator;

    @Test
    void testCalculateATP_SufficientStock() {
        // Given
        ATPCalculator.ATPRequest request = ATPCalculator.ATPRequest.builder()
            .materialCode("HJ-LA23")
            .plantCode("QINGDAO")
            .requestedQty(BigDecimal.valueOf(1000))
            .requestedDate(LocalDate.now().plusDays(7))
            .build();

        when(balanceRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(3840))
                .reservedQty(BigDecimal.ZERO)
                .build()));

        when(inTransitRepository.findByMaterialCodeAndArrivalDateAfter(
            eq("HJ-LA23"), any()))
            .thenReturn(Collections.emptyList());

        when(salesOrderRepository.findAllocatedByMaterialAndDate(
            eq("HJ-LA23"), any(), any()))
            .thenReturn(Collections.emptyList());

        when(reservationRepository.findByMaterialCodeAndPlantCodeAndDate(
            eq("HJ-LA23"), any(), any()))
            .thenReturn(Collections.emptyList());

        // When
        ATPCalculator.ATPResult result = atpCalculator.calculateATP(request);

        // Then
        assertTrue(result.isCanFulfill());
        assertEquals(0, BigDecimal.valueOf(2840).compareTo(result.getAtpQty()));
        assertEquals(LocalDate.now().plusDays(7), result.getPromisedDate());
    }

    @Test
    void testCalculateATP_InsufficientStock() {
        // Given
        ATPCalculator.ATPRequest request = ATPCalculator.ATPRequest.builder()
            .materialCode("HJ-LA23")
            .plantCode("QINGDAO")
            .requestedQty(BigDecimal.valueOf(5000))
            .requestedDate(LocalDate.now().plusDays(7))
            .build();

        when(balanceRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(3840))
                .reservedQty(BigDecimal.ZERO)
                .build()));

        when(inTransitRepository.findByMaterialCodeAndArrivalDateAfter(
            eq("HJ-LA23"), any()))
            .thenReturn(Collections.emptyList());

        when(salesOrderRepository.findAllocatedByMaterialAndDate(
            eq("HJ-LA23"), any(), any()))
            .thenReturn(Collections.emptyList());

        when(reservationRepository.findByMaterialCodeAndPlantCodeAndDate(
            eq("HJ-LA23"), any(), any()))
            .thenReturn(Collections.emptyList());

        // When
        ATPCalculator.ATPResult result = atpCalculator.calculateATP(request);

        // Then
        assertFalse(result.isCanFulfill());
        // ATP = 3840 - 0 - 0 - 0 = 3840, 但需求是 5000
        assertEquals(0, BigDecimal.valueOf(3840).compareTo(result.getAtpQty()));
    }

    @Test
    void testCalculateATP_WithInTransit() {
        // Given
        ATPCalculator.ATPRequest request = ATPCalculator.ATPRequest.builder()
            .materialCode("HJ-LA15")
            .plantCode("QINGDAO")
            .requestedQty(BigDecimal.valueOf(3000))
            .requestedDate(LocalDate.now().plusDays(7))
            .build();

        when(balanceRepository.findByMaterialCodeAndPlantCode("HJ-LA15", "QINGDAO"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(2000))
                .reservedQty(BigDecimal.ZERO)
                .build()));

        when(inTransitRepository.findByMaterialCodeAndArrivalDateAfter(
            eq("HJ-LA15"), any()))
            .thenReturn(Arrays.asList(
                InTransitOrder.builder()
                    .materialCode("HJ-LA15")
                    .quantity(BigDecimal.valueOf(2000))
                    .arrivalDate(LocalDate.now().plusDays(3))
                    .build()
            ));

        when(salesOrderRepository.findAllocatedByMaterialAndDate(
            eq("HJ-LA15"), any(), any()))
            .thenReturn(Collections.emptyList());

        when(reservationRepository.findByMaterialCodeAndPlantCodeAndDate(
            eq("HJ-LA15"), any(), any()))
            .thenReturn(Collections.emptyList());

        // When
        ATPCalculator.ATPResult result = atpCalculator.calculateATP(request);

        // Then
        assertTrue(result.isCanFulfill());
        // ATP = 2000 + 2000 - 0 - 0 = 4000
        assertEquals(0, BigDecimal.valueOf(4000).compareTo(result.getAtpQty()));
    }
}
