package com.hjscm.controller;

import com.hjscm.dto.*;
import com.hjscm.service.SupplierAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 供应商认证控制器
 */
@RestController
@RequestMapping("/api/v1/auth/supplier")
public class SupplierAuthController {

    @Autowired
    private SupplierAuthService authService;

    /**
     * 供应商登录
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResult> login(@RequestBody LoginRequest request) {
        AuthResult result = authService.authenticate(request);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * 获取供应商信息
     */
    @GetMapping("/profile")
    public ResponseEntity<SupplierPrincipal> getProfile(
            @RequestHeader("Authorization") String token) {
        
        String supplierId = authService.getSupplierIdFromToken(token);
        SupplierPrincipal principal = authService.getSupplier(supplierId);
        
        if (principal != null) {
            return ResponseEntity.ok(principal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 验证Token
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.validateToken(token));
    }
}
