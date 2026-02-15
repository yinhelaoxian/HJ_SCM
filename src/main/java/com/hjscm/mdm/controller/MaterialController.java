package com.hjscm.mdm.controller;

import com.hjscm.mdm.dto.MaterialDTO;
import com.hjscm.mdm.entity.MaterialEntity;
import com.hjscm.mdm.service.MaterialService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 物料主数据Controller
 */
@RestController
@RequestMapping("/api/v1/material")
public class MaterialController {
    
    private final MaterialService materialService;
    
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }
    
    /**
     * 创建物料
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createMaterial(@RequestBody MaterialDTO dto) {
        MaterialEntity entity = materialService.createMaterial(dto, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "物料创建成功");
        response.put("data", entity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新物料
     */
    @PutMapping("/{materialId}")
    public ResponseEntity<Map<String, Object>> updateMaterial(
            @PathVariable String materialId,
            @RequestBody MaterialDTO dto) {
        MaterialEntity entity = materialService.updateMaterial(materialId, dto, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "物料更新成功");
        response.put("data", entity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询物料
     */
    @GetMapping("/{materialId}")
    public ResponseEntity<Map<String, Object>> getMaterial(@PathVariable String materialId) {
        MaterialEntity entity = materialService.getMaterial(materialId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", entity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询所有物料
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMaterials() {
        List<MaterialEntity> list = materialService.getAllMaterials();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 分页查询物料
     */
    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getMaterials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<MaterialEntity> pageResult = materialService.getMaterials(PageRequest.of(page, size));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", pageResult.getContent());
        response.put("total", pageResult.getTotalElements());
        response.put("page", pageResult.getNumber());
        response.put("size", pageResult.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 按物料组查询
     */
    @GetMapping("/group/{materialGroup}")
    public ResponseEntity<Map<String, Object>> getMaterialsByGroup(
            @PathVariable String materialGroup) {
        List<MaterialEntity> list = materialService.getMaterialsByGroup(materialGroup);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 搜索物料
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMaterials(
            @RequestParam String keyword) {
        List<MaterialEntity> list = materialService.searchMaterials(keyword);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除物料
     */
    @DeleteMapping("/{materialId}")
    public ResponseEntity<Map<String, Object>> deleteMaterial(@PathVariable String materialId) {
        materialService.deleteMaterial(materialId, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "物料删除成功");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 统计物料数量
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> countMaterials() {
        long count = materialService.countMaterials();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", count);
        
        return ResponseEntity.ok(response);
    }
}
