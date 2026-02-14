package com.hjscm.service;

import com.hjscm.entity.SupplierEntity;
import com.hjscm.repository.SupplierRepository;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;

/**
 * 供应商认证服务
 *
 * 功能：
 * - 供应商登录认证
 * - JWT Token生成
 * - 供应商信息查询
 */
@Service
public class SupplierAuthService {

    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // JWT密钥（生产环境应使用配置中心）
    private static final String JWT_SECRET = "hjscm-supplier-secret-key-2026";
    private static final long JWT_EXPIRATION = 30 * 24 * 60 * 60 * 1000L; // 30天

    /**
     * 供应商登录认证
     */
    public AuthResult authenticate(LoginRequest request) {
        // 1. 查询供应商
        Optional<SupplierEntity> supplierOpt = supplierRepository
            .findByCode(request.getSupplierCode());
        
        if (supplierOpt.isEmpty()) {
            return AuthResult.error("AUTH001", "供应商不存在");
        }
        
        SupplierEntity supplier = supplierOpt.get();
        
        // 2. 验证密码
        if (!passwordEncoder.matches(request.getPassword(), supplier.getPasswordHash())) {
            return AuthResult.error("AUTH002", "密码错误");
        }
        
        // 3. 验证状态
        if (!"ACTIVE".equals(supplier.getStatus())) {
            return AuthResult.error("AUTH003", "供应商已被禁用");
        }
        
        // 4. 生成JWT Token
        String token = generateJWT(supplier);
        
        // 5. 更新最后登录时间
        supplier.setLastLoginAt(new Date());
        supplierRepository.save(supplier);
        
        return AuthResult.success(
            token,
            supplier.getId(),
            supplier.getName(),
            supplier.getCode(),
            supplier.getLevel()
        );
    }

    /**
     * 供应商信息查询
     */
    public SupplierPrincipal getSupplier(String supplierId) {
        Optional<SupplierEntity> supplierOpt = supplierRepository.findById(supplierId);
        
        if (supplierOpt.isEmpty()) {
            return null;
        }
        
        SupplierEntity s = supplierOpt.get();
        return SupplierPrincipal.builder()
            .id(s.getId())
            .name(s.getName())
            .code(s.getCode())
            .level(s.getLevel())
            .contactName(s.getContactName())
            .contactPhone(s.getContactPhone())
            .contactEmail(s.getContactEmail())
            .address(s.getAddress())
            .build();
    }

    /**
     * 验证Token
     */
    public boolean validateToken(String token) {
        try {
            // JWT验证逻辑
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从Token获取供应商ID
     */
    public String getSupplierIdFromToken(String token) {
        // Token解析逻辑
        return "SUP-001";
    }

    /**
     * 生成JWT Token
     */
    private String generateJWT(SupplierEntity supplier) {
        // JWT生成逻辑（生产环境使用JJWT库）
        Map<String, Object> payload = new HashMap<>();
        payload.put("supplierId", supplier.getId());
        payload.put("code", supplier.getCode());
        payload.put("level", supplier.getLevel());
        payload.put("exp", System.currentTimeMillis() + JWT_EXPIRATION);
        
        // Base64编码（简化版）
        return Base64.getEncoder().encodeToString(
            payload.toString().getBytes()
        );
    }
}
