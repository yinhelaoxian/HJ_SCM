package com.hjscm.mdm.repository;

import com.hjscm.mdm.entity.SupplierEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 供应商主数据Repository
 */
@Repository
public interface SupplierRepository extends JpaRepository<SupplierEntity, Long> {
    
    Optional<SupplierEntity> findBySupplierId(String supplierId);
    
    List<SupplierEntity> findBySupplierType(String supplierType);
    
    List<SupplierEntity> findByCategory(String category);
    
    List<SupplierEntity> findByTierLevel(Integer tierLevel);
    
    List<SupplierEntity> findByStatus(String status);
    
    @Query("SELECT s FROM SupplierEntity s WHERE s.supplierName LIKE %:keyword% OR s.supplierId LIKE %:keyword%")
    List<SupplierEntity> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT s FROM SupplierEntity s WHERE s.status = 'ACTIVE' ORDER BY s.qualityRating DESC")
    List<SupplierEntity> findTopSuppliersByQuality();
    
    @Query("SELECT COUNT(s) FROM SupplierEntity s WHERE s.status = :status")
    long countByStatus(@Param("status") String status);
}
