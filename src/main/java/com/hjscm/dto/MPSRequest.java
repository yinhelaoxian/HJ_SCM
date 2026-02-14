package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * MPS请求DTO
 */
@Data
@Builder
public class MPSRequest {
    private String productId;
    private String workCenterId;
    private LocalDate startDate;
    private LocalDate endDate;
}
