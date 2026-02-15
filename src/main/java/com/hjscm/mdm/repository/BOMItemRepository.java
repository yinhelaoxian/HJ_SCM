package com.hjscm.mdm.repository;

import com.hjscm.mdm.entity.BOMItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BOM子件Repository
 */
@Repository
public interface BOMItemRepository extends JpaRepository<BOMItemEntity, Long> {
    
    List<BOMItemEntity> findByBomId(String bomId);
    
    List<BOMItemEntity> findByBomIdOrderByItemSequenceAsc(String bomId);
    
    @Query("SELECT bi FROM BOMItemEntity bi WHERE bi.componentMaterial = :material")
    List<BOMItemEntity> findByComponentMaterial(@Param("material") String material);
    
    @Query("SELECT bi FROM BOMItemEntity bi WHERE bi.operationId = :operationId")
    List<BOMItemEntity> findByOperationId(@Param("operationId") String operationId);
    
    void deleteByBomId(String bomId);
}
