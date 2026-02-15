package com.hjscm.mdm.service;

import com.hjscm.mdm.entity.SupplierEntity;
import com.hjscm.mdm.repository.SupplierRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 供应商主数据Service
 */
@Service
@Transactional
public class SupplierService {
    
    private final SupplierRepository supplierRepository;
    
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    
    /**
     * 创建供应商
     */
    public SupplierEntity createSupplier(SupplierEntity entity, String userId) {
        // 生成供应商编码
        if (entity.getSupplierId() == null || entity.getSupplierId().isEmpty()) {
            entity.setSupplierId(generateSupplierId());
        }
        
        entity.setCreatedBy(userId);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setStatus("ACTIVE");
        
        // 初始化评分为0
        if (entity.getQualityRating() == null) {
            entity.setQualityRating(java.math.BigDecimal.ZERO);
        }
        if (entity.getDeliveryRating() == null) {
            entity.setDeliveryRating(java.math.BigDecimal.ZERO);
        }
        if (entity.getPriceRating() == null) {
            entity.setPriceRating(java.math.BigDecimal.ZERO);
        }
        
        return supplierRepository.save(entity);
    }
    
    /**
     * 更新供应商
     */
    public SupplierEntity updateSupplier(String supplierId, SupplierEntity dto, String userId) {
        SupplierEntity entity = supplierRepository.findBySupplierId(supplierId)
                .orElseThrow(() -> new RuntimeException("供应商不存在: " + supplierId));
        
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        
        return supplierRepository.save(entity);
    }
    
    /**
     * 查询供应商
     */
    @Transactional(readOnly = true)
    public SupplierEntity getSupplier(String supplierId) {
        return supplierRepository.findBySupplierId(supplierId)
                .orElseThrow(() -> new RuntimeException("供应商不存在: " + supplierId));
    }
    
    /**
     * 查询所有供应商
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> getAllSuppliers() {
        return supplierRepository.findByStatus("ACTIVE");
    }
    
    /**
     * 按类型查询
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> getSuppliersByType(String supplierType) {
        return supplierRepository.findBySupplierType(supplierType);
    }
    
    /**
     * 按品类查询
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> getSuppliersByCategory(String category) {
        return supplierRepository.findByCategory(category);
    }
    
    /**
     * 按分级查询
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> getSuppliersByTier(Integer tierLevel) {
        return supplierRepository.findByTierLevel(tierLevel);
    }
    
    /**
     * 搜索供应商
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> searchSuppliers(String keyword) {
        return supplierRepository.searchByKeyword(keyword);
    }
    
    /**
     * 查询优质供应商（按质量评分排序）
     */
    @Transactional(readOnly = true)
    public List<SupplierEntity> getTopSuppliersByQuality() {
        return supplierRepository.findTopSuppliersByQuality();
    }
    
    /**
     * 删除供应商（逻辑删除）
     */
    public void deleteSupplier(String supplierId, String userId) {
        SupplierEntity entity = supplierRepository.findBySupplierId(supplierId)
                .orElseThrow(() -> new RuntimeException("供应商不存在: " + supplierId));
        
        entity.setStatus("INACTIVE");
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        supplierRepository.save(entity);
    }
    
    /**
     * 统计供应商数量
     */
    public long countSuppliers() {
        return supplierRepository.countByStatus("ACTIVE");
    }
    
    private String generateSupplierId() {
        String date = LocalDateTime.now().toLocalDate().toString().replace("-", "");
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "SUP-" + date + "-" + uuid;
    }
}
