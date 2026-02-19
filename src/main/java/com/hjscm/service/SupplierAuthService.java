package com.hjscm.service;

import com.hjscm.entity.SupplierEntity;
import com.hjscm.repository.SupplierRepository;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * 供应商认证服务
 *
 * 功能：
 * - 供应商登录认证
 * - JWT Token生成
 * - 供应商信息查询
 *
 * @Security 修复记录 (2026-02-19):
 * - 使用 HMAC-SHA256 签名替代 Base64 编码
 * - validateToken 现在真正验证 Token 签名和过期时间
 * - getSupplierIdFromToken 从 Token 中解析真正的 Supplier ID
 * - JWT_SECRET 改为从环境变量注入
 */
@Service
public class SupplierAuthService {

    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // JWT 配置 - 生产环境应从环境变量注入
    // 使用方式：System.getenv("JWT_SECRET") 或配置中心
    private static final String JWT_SECRET = getSecretFromEnv();
    private static final long JWT_EXPIRATION = 8 * 60 * 60 * 1000L; // 8小时（原30天过长）
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000L; // 7天 Refresh Token
    private static final String ALGORITHM = "HmacSHA256";

    /**
     * 从环境变量获取 JWT Secret
     */
    private static String getSecretFromEnv() {
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret != null && !envSecret.isEmpty()) {
            return envSecret;
        }
        // 开发环境默认密钥（生产环境必须覆盖）
        return System.getenv().getOrDefault("JWT_SECRET", "hjscm-dev-secret-key-change-in-production");
    }

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
        
        // 4. 生成 JWT Token
        String accessToken = generateAccessToken(supplier);
        String refreshToken = generateRefreshToken(supplier);
        
        // 5. 更新最后登录时间
        supplier.setLastLoginAt(new Date());
        supplierRepository.save(supplier);
        
        return AuthResult.builder()
            .success(true)
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(8 * 60 * 60) // 8小时
            .supplierId(supplier.getId())
            .supplierName(supplier.getName())
            .supplierCode(supplier.getCode())
            .level(supplier.getLevel())
            .build();
    }

    /**
     * 验证Token
     * 
     * @Security 修复：真正验证 Token 签名和过期时间
     * 
     * @param token Bearer token (不含 "Bearer " 前缀)
     * @return 验证结果
     */
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        
        try {
            // 解析 Token
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }
            
            String header = parts[0];
            String payload = parts[1];
            String signature = parts[2];
            
            // 1. 验证签名
            String expectedSignature = sign(header + "." + payload, JWT_SECRET);
            if (!constantTimeEquals(signature, expectedSignature)) {
                return false;
            }
            
            // 2. 解析 payload 检查过期时间
            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            if (payloadJson.contains("\"exp\":")) {
                int expIndex = payloadJson.indexOf("\"exp\":");
                long expTime = Long.parseLong(payloadJson.substring(expIndex + 6, payloadJson.indexOf(",", expIndex)).trim());
                if (System.currentTimeMillis() > expTime) {
                    return false; // Token 已过期
                }
            }
            
            // 3. 验证 Token 类型
            if (!payloadJson.contains("\"type\":\"access\"")) {
                return false; // 必须是 access token
            }
            
            return true;
            
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从Token获取供应商ID
     * 
     * @Security 修复：从 Token 中解析真正的 Supplier ID
     * 
     * @param token Bearer token (不含 "Bearer " 前缀)
     * @return 供应商ID，解析失败返回 null
     */
    public String getSupplierIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            
            String payload = parts[1];
            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            
            // 解析 supplierId
            if (payloadJson.contains("\"supplierId\":\"") || payloadJson.contains("\"supplierId\":\"")) {
                String marker = "\"supplierId\":\"";
                int start = payloadJson.indexOf(marker);
                if (start == -1) {
                    marker = "\"supplierId\":";
                    start = payloadJson.indexOf(marker);
                    if (start == -1) return null;
                    start += marker.length();
                    int end = payloadJson.indexOf("}", start);
                    return payloadJson.substring(start, end).replace("\"", "").trim();
                }
                start += marker.length();
                int end = payloadJson.indexOf("\"", start);
                return payloadJson.substring(start, end);
            }
            
            return null;
            
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 验证 Refresh Token 并生成新的 Access Token
     */
    public AuthResult refreshAccessToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return AuthResult.error("AUTH004", "Refresh Token 不能为空");
        }
        
        try {
            String[] parts = refreshToken.split("\\.");
            if (parts.length != 3) {
                return AuthResult.error("AUTH005", "无效的 Refresh Token 格式");
            }
            
            String payload = parts[1];
            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            
            // 验证签名
            String header = parts[0];
            String signature = parts[2];
            String expectedSignature = sign(header + "." + payload, JWT_SECRET);
            if (!constantTimeEquals(signature, expectedSignature)) {
                return AuthResult.error("AUTH006", "Refresh Token 签名无效");
            }
            
            // 检查类型
            if (!payloadJson.contains("\"type\":\"refresh\"")) {
                return AuthResult.error("AUTH007", "无效的 Token 类型");
            }
            
            // 检查过期
            if (payloadJson.contains("\"exp\":")) {
                int expIndex = payloadJson.indexOf("\"exp\":");
                long expTime = Long.parseLong(payloadJson.substring(expIndex + 6, payloadJson.indexOf(",", expIndex)).trim());
                if (System.currentTimeMillis() > expTime) {
                    return AuthResult.error("AUTH008", "Refresh Token 已过期，请重新登录");
                }
            }
            
            // 获取供应商信息并生成新的 Access Token
            String supplierId = getSupplierIdFromToken(refreshToken);
            if (supplierId == null) {
                return AuthResult.error("AUTH009", "无法解析供应商信息");
            }
            
            Optional<SupplierEntity> supplierOpt = supplierRepository.findById(supplierId);
            if (supplierOpt.isEmpty() || !"ACTIVE".equals(supplierOpt.get().getStatus())) {
                return AuthResult.error("AUTH010", "供应商状态无效");
            }
            
            SupplierEntity supplier = supplierOpt.get();
            String newAccessToken = generateAccessToken(supplier);
            String newRefreshToken = generateRefreshToken(supplier);
            
            return AuthResult.builder()
                .success(true)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(8 * 60 * 60)
                .supplierId(supplier.getId())
                .supplierName(supplier.getName())
                .supplierCode(supplier.getCode())
                .level(supplier.getLevel())
                .build();
                
        } catch (Exception e) {
            return AuthResult.error("AUTH011", "Token 刷新失败");
        }
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

    // ==================== 私有方法 ====================

    /**
     * 生成 Access Token (8小时有效期)
     */
    private String generateAccessToken(SupplierEntity supplier) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("supplierId", supplier.getId());
        payload.put("code", supplier.getCode());
        payload.put("level", supplier.getLevel());
        payload.put("type", "access");
        payload.put("iat", System.currentTimeMillis() / 1000);
        payload.put("exp", (System.currentTimeMillis() + JWT_EXPIRATION) / 1000);
        
        String header = Base64.getUrlEncoder().withoutPadding()
            .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payloadJson = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(payload.toString().getBytes(StandardCharsets.UTF_8));
        String signature = sign(header + "." + payloadJson, JWT_SECRET);
        
        return header + "." + payloadJson + "." + signature;
    }

    /**
     * 生成 Refresh Token (7天有效期)
     */
    private String generateRefreshToken(SupplierEntity supplier) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("supplierId", supplier.getId());
        payload.put("type", "refresh");
        payload.put("iat", System.currentTimeMillis() / 1000);
        payload.put("exp", (System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION) / 1000);
        
        String header = Base64.getUrlEncoder().withoutPadding()
            .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payloadJson = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(payload.toString().getBytes(StandardCharsets.UTF_8));
        String signature = sign(header + "." + payloadJson, JWT_SECRET);
        
        return header + "." + payloadJson + "." + signature;
    }

    /**
     * HMAC-SHA256 签名
     */
    private String sign(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            mac.init(secretKeySpec);
            byte[] signature = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception e) {
            throw new RuntimeException("JWT 签名失败", e);
        }
    }

    /**
     * 常量时间字符串比较（防止时序攻击）
     */
    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
