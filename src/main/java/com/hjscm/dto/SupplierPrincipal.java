package com.hjscm.dto;

import lombok.Data;

/**
 * 供应商Principal DTO
 */
@Data
public class SupplierPrincipal {
    private String id;
    private String name;
    private String code;
    private String level;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String address;
}
