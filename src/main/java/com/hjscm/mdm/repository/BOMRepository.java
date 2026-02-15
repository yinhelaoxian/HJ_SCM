package com.hjscm.mdm.repository;

import com.hjscm.mdm.entity.BOMEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * BOM主数据Repository
 */
@Repository
public interface BOMRepository extends JpaRepository<BOMEntity, Long> {
    
    Optional<BOMEntity> findByBomId(String bomId);
    
    List<BOMEntity> findByMaterial(String material);
    
    List<BOMEntity> findByMaterialAndStatus(String material, String status);
    
    List<BOMEntity> findByBomLevel(Integer bomLevel);
    
    @Query("SELECT b FROM BOMEntity b WHERE b.material = :material AND b.status = 'ACTIVE' AND " +
           "(b.validityStart IS NULL OR b.validityStart <= CURRENT_TIMESTAMP) AND " +
           "(b.validityEnd IS NULL OR b.validityEnd >= CURRENT_TIMESTAMP)")
    List<BOMEntity> findActiveBOMsByMaterial(@Param("material") String material);
    
    @Query("SELECT COUNT(b) FROM BOMEntity b WHERE b.status = :status")
    long countByStatus(@Param("status") String status);
}
