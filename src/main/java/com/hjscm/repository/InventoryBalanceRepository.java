package com.hjscm.repository;

import com.hjscm.entity.InventoryBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 库存余额Repository
 * 
 * 功能：
 * - 查询库存余额
 * - 支持物料+工厂查询
 * - 安全库存计算
 */
@Repository
public interface InventoryBalanceRepository extends JpaRepository<InventoryBalance, String> {
    
    /**
     * 根据物料ID查询
     */
    List<InventoryBalance> findByMaterialId(String materialId);
    
    /**
     * 根据物料编码查询（测试用例使用）
     */
    Optional<InventoryBalance> findByMaterialCode(String materialCode);
    
    /**
     * 根据物料ID列表批量查询
     */
    List<InventoryBalance> findByMaterialIdIn(List<String> materialIds);
    
    /**
     * 根据物料编码列表批量查询（测试用例使用）
     */
    @Query("SELECT b FROM InventoryBalance b WHERE b.materialCode IN :materialCodes")
    List<InventoryBalance> findByMaterialCodeIn(@Param("materialCodes") List<String> materialCodes);
    
    /**
     * 根据物料编码和工厂查询
     */
    Optional<InventoryBalance> findByMaterialCodeAndPlantCode(String materialCode, String plantCode);
    
    /**
     * 根据物料编码和日期查询库存（测试用例使用）
     */
    @Query("SELECT b FROM InventoryBalance b WHERE b.materialCode = :materialCode AND b.asOfDate <= :asOfDate ORDER BY b.asOfDate DESC")
    Optional<InventoryBalance> findByMaterialCodeAndAsOfDate(
        @Param("materialCode") String materialCode,
        @Param("asOfDate") LocalDate asOfDate);
    
    /**
     * 查询指定日期前的库存
     */
    @Query("SELECT b FROM InventoryBalance b WHERE b.asOfDate <= :date ORDER BY b.asOfDate DESC")
    List<InventoryBalance> findBalancesAsOfDate(@Param("date") LocalDateTime date);
    
    /**
     * 获取安全库存（测试用例使用）
     */
    @Query("SELECT b.safetyStock FROM InventoryBalance b WHERE b.materialCode = :materialCode")
    BigDecimal getSafetyStock(@Param("materialCode") String materialCode);
    
    /**
     * 根据仓库查询
     */
    Optional<InventoryBalance> findByMaterialIdAndWarehouseId(String materialId, String warehouseId);
    
    /**
     * 根据工厂查询库存
     */
    List<InventoryBalance> findByPlantCode(String plantCode);
}
