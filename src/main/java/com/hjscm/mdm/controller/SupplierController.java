package com.hjscm.mdm.controller;

import com.hjscm.mdm.entity.SupplierEntity;
import com.hjscm.mdm.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 供应商主数据Controller
 */
@RestController
@RequestMapping("/api/v1/supplier")
public class SupplierController {
    
    private final SupplierService supplierService;
    
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }
    
    /**
     * 创建供应商
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSupplier(@RequestBody SupplierEntity entity) {
        SupplierEntity saved = supplierService.createSupplier(entity, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "供应商创建成功");
        response.put("data", saved);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新供应商
     */
    @PutMapping("/{supplierId}")
    public ResponseEntity<Map<String, Object>> updateSupplier(
            @PathVariable String supplierId,
            @RequestBody SupplierEntity entity) {
        SupplierEntity saved = supplierService.updateSupplier(supplierId, entity, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "供应商更新成功");
        response.put("data", saved);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询供应商
     */
    @GetMapping("/{supplierId}")
    public ResponseEntity<Map<String, Object>> getSupplier(@PathVariable String supplierId) {
        SupplierEntity entity = supplierService.getSupplier(supplierId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", entity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询所有供应商
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSuppliers() {
        List<SupplierEntity> list = supplierService.getAllSuppliers();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 按类型查询
     */
    @GetMapping("/type/{supplierType}")
    public ResponseEntity<Map<String, Object>> getSuppliersByType(@PathVariable String supplierType) {
        List<SupplierEntity> list = supplierService.getSuppliersByType(supplierType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 按品类查询
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getSuppliersByCategory(@PathVariable String category) {
        List<SupplierEntity> list = supplierService.getSuppliersByCategory(category);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 按分级查询
     */
    @GetMapping("/tier/{tierLevel}")
    public ResponseEntity<Map<String, Object>> getSuppliersByTier(@PathVariable Integer tierLevel) {
        List<SupplierEntity> list = supplierService.getSuppliersByTier(tierLevel);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 搜索供应商
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSuppliers(@RequestParam String keyword) {
        List<SupplierEntity> list = supplierService.searchSuppliers(keyword);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询优质供应商
     */
    @GetMapping("/top")
    public ResponseEntity<Map<String, Object>> getTopSuppliers() {
        List<SupplierEntity> list = supplierService.getTopSuppliersByQuality();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        response.put("total", list.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除供应商
     */
    @DeleteMapping("/{supplierId}")
    public ResponseEntity<Map<String, Object>> deleteSupplier(@PathVariable String supplierId) {
        supplierService.deleteSupplier(supplierId, "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "供应商删除成功");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 统计供应商数量
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> countSuppliers() {
        long count = supplierService.countSuppliers();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", count);
        
        return ResponseEntity.ok(response);
    }
}
