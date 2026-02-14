package com.hjscm.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 认证结果DTO
 */
@Data
public class AuthResult {
    private boolean success;
    private String token;
    private String supplierId;
    private String supplierName;
    private String supplierCode;
    private String supplierLevel;
    private String errorCode;
    private String errorMessage;
    private LocalDateTime expiresAt;

    public static AuthResult success(String token, String supplierId, 
            String supplierName, String supplierCode, String supplierLevel) {
        AuthResult result = new AuthResult();
        result.setSuccess(true);
        result.setToken(token);
        result.setSupplierId(supplierId);
        result.setSupplierName(supplierName);
        result.setSupplierCode(supplierCode);
        result.setSupplierLevel(supplierLevel);
        result.setExpiresAt(LocalDateTime.now().plusDays(30));
        return result;
    }

    public static AuthResult error(String code, String message) {
        AuthResult result = new AuthResult();
        result.setSuccess(false);
        result.setErrorCode(code);
        result.setErrorMessage(message);
        return result;
    }
}
