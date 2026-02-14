package com.hjscm.dto;

import lombok.Data;

/**
 * 登录请求DTO
 */
@Data
public class LoginRequest {
    private String supplierCode;
    private String password;
    private String captcha;
    private String captchaKey;
}
