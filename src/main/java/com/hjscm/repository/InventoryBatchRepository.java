package com.hjscm.repository;

import com.hjscm.entity.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 库存批次Repository
 */
@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, String> {
    
    List<InventoryBatch> findByMaterialId(String materialId);
    
    List<InventoryBatch> findByMaterialIdAndStatusOrderByExpiryDateAsc(
        String materialId, 
        String status
    );
    
    List<InventoryBatch> findByBatchNumber(String batchNumber);
    
    @Query("SELECT b FROM InventoryBatch b WHERE b.materialId IN :materialIds AND b.status = 'AVAILABLE'")
    List<InventoryBatch> findAvailableByMaterialIds(
        @Param("materialIds") List<String> materialIds
    );
    
    @Query("SELECT b FROM InventoryBatch b WHERE b.medicalGrade = true AND b.status = 'AVAILABLE'")
    List<InventoryBatch> findMedicalAvailable();
}
