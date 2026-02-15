package com.hjscm.mdm.controller;

import com.hjscm.mdm.dto.BOMDTO;
import com.hjscm.mdm.dto.BOMItemDTO;
import com.hjscm.mdm.entity.BOMEntity;
import com.hjscm.mdm.entity.BOMItemEntity;
import com.hjscm.mdm.service.BOMService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BOM主数据Controller
 */
@RestController
@RequestMapping("/api/v1/bom")
public class BOMController {
    
    private final BOMService bomService;
    
    public BOMController(BOMService bomService) {
        this.bomService = bomService;
    }
    
    /**
     * 创建BOM
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBOM(@RequestBody BOMDTO dto) {
        // 转换DTO到实体
        BOMEntity bom = new BOMEntity();
        BeanUtils.copyProperties(dto, bom);
        
        List<BOMItemEntity> items = null;
        if (dto.getItems() != null) {
            items = dto.getItems().stream()
                    .map(itemDto -> {
                        BOMItemEntity item = new BOMItemEntity();
                        BeanUtils.copyProperties(itemDto, item);
                        return item;
                    })
                    .collect(Collectors.toList());
        }
        
        BOMEntity savedBOM = bomService.createBOM(bom, items, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "BOM创建成功");
        response.put("data", savedBOM);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新BOM
     */
    @PutMapping("/{bomId}")
    public ResponseEntity<Map<String, Object>> updateBOM(
            @PathVariable String bomId,
            @RequestBody BOMDTO dto) {
        BOMEntity bom = new BOMEntity();
        BeanUtils.copyProperties(dto, bom);
        
        List<BOMItemEntity> items = null;
        if (dto.getItems() != null) {
            items = dto.getItems().stream()
                    .map(itemDto -> {
                        BOMItemEntity item = new BOMItemEntity();
                        BeanUtils.copyProperties(itemDto, item);
                        return item;
                    })
                    .collect(Collectors.toList());
        }
        
        BOMEntity savedBOM = bomService.updateBOM(bomId, bom, items, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "BOM更新成功");
        response.put("data", savedBOM);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询BOM
     */
    @GetMapping("/{bomId}")
    public ResponseEntity<Map<String, Object>> getBOM(@PathVariable String bomId) {
        BOMEntity bom = bomService.getBOM(bomId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bom);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询BOM及子件
     */
    @GetMapping("/{bomId}/items")
    public ResponseEntity<Map<String, Object>> getBOMWithItems(@PathVariable String bomId) {
        BOMEntity bom = bomService.getBOMWithItems(bomId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bom);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 按父级物料查询BOM
     */
    @GetMapping("/material/{material}")
    public ResponseEntity<Map<String, Object>> getBOMsByMaterial(@PathVariable String material) {
        List<BOMEntity> list = bomService.getActiveBOMsByMaterial(material);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 展开BOM
     */
    @GetMapping("/{material}/explode")
    public ResponseEntity<Map<String, Object>> explodeBOM(
            @PathVariable String material,
            @RequestParam(defaultValue = "5") int maxLevel) {
        List<BOMItemEntity> exploded = bomService.explodeBOM(material, maxLevel);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", exploded);
        response.put("total", exploded.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除BOM
     */
    @DeleteMapping("/{bomId}")
    public ResponseEntity<Map<String, Object>> deleteBOM(@PathVariable String bomId) {
        bomService.deleteBOM(bomId, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "BOM删除成功");
        
        return ResponseEntity.ok(response);
    }
}
