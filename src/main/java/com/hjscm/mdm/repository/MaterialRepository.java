package com.hjscm.mdm.repository;

import com.hjscm.mdm.entity.MaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 物料主数据Repository
 */
@Repository
public interface MaterialRepository extends JpaRepository<MaterialEntity, Long> {
    
    Optional<MaterialEntity> findByMaterialId(String materialId);
    
    List<MaterialEntity> findByMaterialGroup(String materialGroup);
    
    List<MaterialEntity> findByMaterialType(String materialType);
    
    List<MaterialEntity> findByStatus(String status);
    
    List<MaterialEntity> findByMaterialGroupAndStatus(String materialGroup, String status);
    
    @Query("SELECT m FROM MaterialEntity m WHERE m.materialName LIKE %:keyword% OR m.materialId LIKE %:keyword%")
    List<MaterialEntity> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT m FROM MaterialEntity m WHERE m.abcClass = :abcClass")
    List<MaterialEntity> findByABCClass(@Param("abcClass") String abcClass);
    
    @Query("SELECT COUNT(m) FROM MaterialEntity m WHERE m.status = :status")
    long countByStatus(@Param("status") String status);
}
