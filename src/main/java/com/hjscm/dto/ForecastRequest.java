package com.hjscm.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 预测请求DTO
 */
@Data
@Builder
public class ForecastRequest {
    private String materialId;
    private Integer weeks;
    private String method;  // ma/ets/seasonal
    private LocalDate startDate;
}
