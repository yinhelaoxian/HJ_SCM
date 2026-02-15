package com.hjscm.mdm.service;

import com.hjscm.mdm.entity.BOMEntity;
import com.hjscm.mdm.entity.BOMItemEntity;
import com.hjscm.mdm.repository.BOMRepository;
import com.hjscm.mdm.repository.BOMItemRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * BOM服务
 */
@Service
@Transactional
public class BOMService {
    
    private final BOMRepository bomRepository;
    private final BOMItemRepository bomItemRepository;
    
    public BOMService(BOMRepository bomRepository, BOMItemRepository bomItemRepository) {
        this.bomRepository = bomRepository;
        this.bomItemRepository = bomItemRepository;
    }
    
    /**
     * 创建BOM
     */
    public BOMEntity createBOM(BOMEntity bom, List<BOMItemEntity> items, String userId) {
        // 生成BOM编码
        if (bom.getBomId() == null || bom.getBomId().isEmpty()) {
            bom.setBomId(generateBOMId());
        }
        
        bom.setCreatedBy(userId);
        bom.setCreatedTime(LocalDateTime.now());
        bom.setStatus("ACTIVE");
        
        BOMEntity savedBOM = bomRepository.save(bom);
        
        // 保存BOM子件
        if (items != null && !items.isEmpty()) {
            int seq = 1;
            for (BOMItemEntity item : items) {
                item.setBomId(savedBOM.getBomId());
                item.setItemSequence(seq++);
                item.setCreatedBy(userId);
                bomItemRepository.save(item);
            }
        }
        
        return savedBOM;
    }
    
    /**
     * 更新BOM
     */
    public BOMEntity updateBOM(String bomId, BOMEntity dto, List<BOMItemEntity> items, String userId) {
        BOMEntity entity = bomRepository.findByBomId(bomId)
                .orElseThrow(() -> new RuntimeException("BOM不存在: " + bomId));
        
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        
        // 更新子件
        if (items != null) {
            bomItemRepository.deleteByBomId(bomId);
            int seq = 1;
            for (BOMItemEntity item : items) {
                item.setBomId(bomId);
                item.setItemSequence(seq++);
                item.setCreatedBy(userId);
                bomItemRepository.save(item);
            }
        }
        
        return bomRepository.save(entity);
    }
    
    /**
     * 查询BOM
     */
    @Transactional(readOnly = true)
    public BOMEntity getBOM(String bomId) {
        return bomRepository.findByBomId(bomId)
                .orElseThrow(() -> new RuntimeException("BOM不存在: " + bomId));
    }
    
    /**
     * 查询BOM及子件
     */
    @Transactional(readOnly = true)
    public BOMEntity getBOMWithItems(String bomId) {
        BOMEntity bom = getBOM(bomId);
        List<BOMItemEntity> items = bomItemRepository.findByBomIdOrderByItemSequenceAsc(bomId);
        // 通过反射设置子件
        try {
            var field = BOMEntity.class.getDeclaredField("components");
            field.setAccessible(true);
            field.set(bom, items);
        } catch (Exception e) {
            // 忽略
        }
        return bom;
    }
    
    /**
     * 按父级物料查询BOM
     */
    @Transactional(readOnly = true)
    public List<BOMEntity> getBOMsByMaterial(String material) {
        return bomRepository.findByMaterialAndStatus(material, "ACTIVE");
    }
    
    /**
     * 按父级物料查询有效的BOM
     */
    @Transactional(readOnly = true)
    public List<BOMEntity> getActiveBOMsByMaterial(String material) {
        return bomRepository.findActiveBOMsByMaterial(material);
    }
    
    /**
     * 展开BOM（多层级）
     */
    @Transactional(readOnly = true)
    public List<BOMItemEntity> explodeBOM(String material, int maxLevel) {
        List<BOMItemEntity> result = new ArrayList<>();
        explodeBOMRecursive(material, 1, maxLevel, 1.0, result);
        return result;
    }
    
    private void explodeBOMRecursive(String material, int currentLevel, int maxLevel, 
                                     java.math.BigDecimal parentQty, List<BOMItemEntity> result) {
        if (currentLevel > maxLevel) {
            return;
        }
        
        List<BOMEntity> boms = getActiveBOMsByMaterial(material);
        if (boms.isEmpty()) {
            return;
        }
        
        for (BOMEntity bom : boms) {
            List<BOMItemEntity> items = bomItemRepository.findByBomIdOrderByItemSequenceAsc(bom.getBomId());
            for (BOMItemEntity item : items) {
                // 计算需求量
                java.math.BigDecimal requiredQty = parentQty.multiply(item.getComponentQty());
                
                // 创建展开结果
                BOMItemEntity explodedItem = new BOMItemEntity();
                explodedItem.setComponentMaterial(item.getComponentMaterial());
                explodedItem.setComponentQty(requiredQty);
                explodedItem.setBomId(bom.getBomId());
                explodedItem.setOperationId(item.getOperationId());
                explodedItem.setScrapAddRate(item.getScrapAddRate());
                explodedItem.setItemSequence(currentLevel);
                
                result.add(explodedItem);
                
                // 递归展开子件
                if (currentLevel < maxLevel) {
                    explodeBOMRecursive(item.getComponentMaterial(), currentLevel + 1, maxLevel, requiredQty, result);
                }
            }
        }
    }
    
    /**
     * 删除BOM（逻辑删除）
     */
    public void deleteBOM(String bomId, String userId) {
        BOMEntity entity = bomRepository.findByBomId(bomId)
                .orElseThrow(() -> new RuntimeException("BOM不存在: " + bomId));
        
        entity.setStatus("INACTIVE");
        entity.setUpdatedBy(userId);
        entity.setUpdatedTime(LocalDateTime.now());
        bomRepository.save(entity);
    }
    
    private String generateBOMId() {
        String date = LocalDateTime.now().toLocalDate().toString().replace("-", "");
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "BOM-" + date + "-" + uuid;
    }
}
