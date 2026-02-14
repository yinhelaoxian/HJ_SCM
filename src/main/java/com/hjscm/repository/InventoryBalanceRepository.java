package com.hjscm.repository;

import com.hjscm.entity.InventoryBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 库存余额Repository
 */
@Repository
public interface InventoryBalanceRepository extends JpaRepository<InventoryBalance, String> {
    
    List<InventoryBalance> findByMaterialId(String materialId);
    
    List<InventoryBalance> findByMaterialIdIn(List<String> materialIds);
    
    @Query("SELECT b FROM InventoryBalance b WHERE b.materialId IN :materialIds")
    List<InventoryBalance> findByMaterialIdIn(
        @Param("materialIds") List<String> materialIds
    );
    
    Optional<InventoryBalance> findByMaterialIdAndWarehouseId(
        String materialId, 
        String warehouseId
    );
    
    @Query("SELECT b FROM InventoryBalance b WHERE b.asOfDate <= :date ORDER BY b.asOfDate DESC")
    List<InventoryBalance> findBalancesAsOfDate(
        @Param("date") LocalDateTime date
    );
}
