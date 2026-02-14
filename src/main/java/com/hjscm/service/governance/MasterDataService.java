package com.hjscm.service.governance;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

/**
 * 主数据治理服务
 * 
 * 功能：
 * - 物料主数据治理
 * - 客户主数据治理
 * - 供应商主数据治理
 * - 编码规则管理
 * - 数据质量检查
 */
@Service
public class MasterDataService {

    @Autowired
    private MaterialRepository materialRepository;
    
    @Autowired  
    private CustomerRepository customerRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private DataQualityRepository qualityRepository;

    // ==================== 物料主数据 ====================
    
    /**
     * 物料主数据治理
     */
    public MaterialEntity governMaterial(MaterialCreateRequest request) {
        // 1. 编码校验
        validateMaterialCode(request.getMaterialCode());
        
        // 2. 重复检测
        checkMaterialDuplicate(request);
        
        // 3. 数据清洗
        MaterialEntity material = cleanMaterialData(request);
        
        // 4. 质量检查
        QualityCheckResult quality = checkMaterialQuality(material);
        
        // 5. 保存
        MaterialEntity saved = materialRepository.save(material);
        
        // 6. 记录质量日志
        logQualityCheck(saved, quality);
        
        return saved;
    }
    
    /**
     * 物料编码规则校验
     */
    private void validateMaterialCode(String code) {
        if (code == null || !code.matches("^[A-Z]{3}-[A-Z0-9]{3,10}$")) {
            throw new GovernanceException("MATERIAL001", 
                "物料编码格式错误，应为XXX-XXXXXX格式");
        }
    }
    
    /**
     * 物料重复检测
     */
    private void checkMaterialDuplicate(MaterialCreateRequest request) {
        // 编码重复
        if (materialRepository.existsByCode(request.getMaterialCode())) {
            throw new GovernanceException("MATERIAL002", "物料编码已存在");
        }
        
        // 名称重复（模糊匹配）
        if (materialRepository.existsByNameLike(request.getMaterialName())) {
            throw new GovernanceException("MATERIAL003", "物料名称可能重复");
        }
    }
    
    /**
     * 物料数据清洗
     */
    private MaterialEntity cleanMaterialData(MaterialCreateRequest request) {
        return MaterialEntity.builder()
            .materialCode(request.getMaterialCode().toUpperCase().trim())
            .materialName(request.getMaterialName().trim())
            .category(request.getCategory())
            .unit(request.getUnit())
            .specification(request.getSpecification())
            .build();
    }
    
    // ==================== 客户主数据治理 ====================
    
    /**
     * 客户主数据治理
     */
    public CustomerEntity governCustomer(CustomerCreateRequest request) {
        validateCustomerCode(request.getCustomerCode());
        checkCustomerDuplicate(request);
        CustomerEntity cleaned = cleanCustomerData(request);
        return customerRepository.save(cleaned);
    }
    
    // ==================== 供应商主数据治理 ====================
    
    /**
     * 供应商主数据治理
     */
    public SupplierEntity governSupplier(SupplierCreateRequest request) {
        validateSupplierCode(request.getSupplierCode());
        checkSupplierDuplicate(request);
        SupplierEntity cleaned = cleanSupplierData(request);
        return supplierRepository.save(cleaned);
    }
    
    // ==================== 质量检查 ====================
    
    /**
     * 数据质量检查
     */
    public QualityResult checkQuality(String entityType, String entityId) {
        QualityResult.QualityResultBuilder builder = QualityResult.builder()
            .entityType(entityType)
            .entityId(entityId)
            .checkTime(LocalDateTime.now());
        
        List<QualityIssue> issues = new ArrayList<>();
        
        // 完整性检查
        List<QualityIssue> completeness = checkCompleteness(entityType, entityId);
        issues.addAll(completeness);
        
        // 一致性检查
        List<QualityIssue> consistency = checkConsistency(entityType, entityId);
        issues.addAll(consistency);
        
        builder.issues(issues)
              .score(calculateQualityScore(issues));
        
        return builder.build();
    }
    
    /**
     * 完整性检查
     */
    private List<QualityIssue> checkCompleteness(String entityType, String entityId) {
        List<QualityIssue> issues = new ArrayList<>();
        
        // 检查必填字段
        // 检查数据完整性
        // 检查关联关系
        
        return issues;
    }
    
    /**
     * 一致性检查
     */
    private List<QualityIssue> checkConsistency(String entityType, String entityId) {
        List<QualityIssue> issues = new ArrayList<>();
        
        // 跨系统数据一致性
        // 主从数据一致性
        
        return issues;
    }
    
    /**
     * 质量评分计算
     */
    private double calculateQualityScore(List<QualityIssue> issues) {
        if (issues.isEmpty()) return 100.0;
        
        int critical = (int) issues.stream()
            .filter(i -> "CRITICAL".equals(i.getSeverity())).count();
        int major = (int) issues.stream()
            .filter(i -> "MAJOR".equals(i.getSeverity())).count();
        int minor = (int) issues.stream()
            .filter(i -> "MINOR".issues.stream()
            .filter(i -> "MINOR".equals(i.getSeverity())).count();
        
        double score = 100.0;
        score -= critical * 10;
        score -= major * 5;
        score -= minor * 1;
        
        return Math.max(0, score);
    }
}
