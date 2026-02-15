package com.hjscm.mdm.service;

import com.hjscm.mdm.entity.MaterialEntity;
import com.hjscm.mdm.repository.MaterialRepository;
import com.hjscm.mdm.dto.MaterialDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 物料主数据Service
 */
@Service
@Transactional
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    
    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }
    
    /**
     * 创建物料
     */
    public MaterialEntity createMaterial(MaterialDTO dto, String userId) {
        MaterialEntity entity = new MaterialEntity();
        BeanUtils.copyProperties(dto, entity);
        
        // 生成物料编码
        if (entity.getMaterialId() == null || entity.getMaterialId().isEmpty()) {
            entity.setMaterialId(generateMaterialId());
        }
        
        entity.setCreatedBy(userId);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setStatus("ACTIVE");
        
        return materialRepository.save(entity);
    }
    
    /**
     * 更新物料
     */
    public MaterialEntity updateMaterial(String materialId, MaterialDTO dto, String userId) {
        MaterialEntity entity = materialRepository.findByMaterialId(materialId)
                .orElseThrow(() -> new RuntimeException("物料不存在: " + materialId));
        
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        
        return materialRepository.save(entity);
    }
    
    /**
     * 查询物料
     */
    @Transactional(readOnly = true)
    public MaterialEntity getMaterial(String materialId) {
        return materialRepository.findByMaterialId(materialId)
                .orElseThrow(() -> new RuntimeException("物料不存在: " + materialId));
    }
    
    /**
     * 查询所有物料
     */
    @Transactional(readOnly = true)
    public List<MaterialEntity> getAllMaterials() {
        return materialRepository.findByStatus("ACTIVE");
    }
    
    /**
     * 分页查询物料
     */
    @Transactional(readOnly = true)
    public Page<MaterialEntity> getMaterials(Pageable pageable) {
        return materialRepository.findAll(pageable);
    }
    
    /**
     * 按物料组查询
     */
    @Transactional(readOnly = true)
    public List<MaterialEntity> getMaterialsByGroup(String materialGroup) {
        return materialRepository.findByMaterialGroupAndStatus(materialGroup, "ACTIVE");
    }
    
    /**
     * 搜索物料
     */
    @Transactional(readOnly = true)
    public List<MaterialEntity> searchMaterials(String keyword) {
        return materialRepository.searchByKeyword(keyword);
    }
    
    /**
     * 删除物料（逻辑删除）
     */
    public void deleteMaterial(String materialId, String userId) {
        MaterialEntity entity = materialRepository.findByMaterialId(materialId)
                .orElseThrow(() -> new RuntimeException("物料不存在: " + materialId));
        
        entity.setStatus("INACTIVE");
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        materialRepository.save(entity);
    }
    
    /**
     * 生成物料编码
     */
    private String generateMaterialId() {
        // 格式: MAT-YYYYMMDD-XXXXXX
        String date = LocalDateTime.now().toLocalDate().toString().replace("-", "");
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "MAT-" + date + "-" + uuid;
    }
    
    /**
     * 统计物料数量
     */
    public long countMaterials() {
        return materialRepository.countByStatus("ACTIVE");
    }
}
