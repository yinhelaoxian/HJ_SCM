package com.hjscm.repository;

import com.hjscm.entity.ProcurementSuggestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 采购建议Repository
 * 
 * 功能：
 * - 查询采购建议
 * - 按状态筛选
 * - 按时间范围查询
 */
@Repository
public interface ProcurementSuggestionRepository extends JpaRepository<ProcurementSuggestionEntity, String> {

    /**
     * 根据物料编码查询
     */
    List<ProcurementSuggestionEntity> findByMaterialCode(String materialCode);

    /**
     * 根据工厂查询
     */
    List<ProcurementSuggestionEntity> findByPlantCode(String plantCode);

    /**
     * 根据状态查询
     */
    List<ProcurementSuggestionEntity> findByStatus(String status);

    /**
     * 根据物料和工厂查询
     */
    List<ProcurementSuggestionEntity> findByMaterialCodeAndPlantCode(
        String materialCode, String plantCode);

    /**
     * 查询指定日期范围内的建议
     */
    @Query("SELECT p FROM ProcurementSuggestionEntity p WHERE p.suggestedDate BETWEEN :startDate AND :endDate")
    List<ProcurementSuggestionEntity> findByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * 查询未处理的建议
     */
    @Query("SELECT p FROM ProcurementSuggestionEntity p WHERE p.status = 'PENDING' ORDER BY p.priority DESC")
    List<ProcurementSuggestionEntity> findPendingSuggestions();

    /**
     * 根据供应商查询
     */
    List<ProcurementSuggestionEntity> findBySupplierCode(String supplierCode);

    /**
     * 检查是否存在未处理的建议
     */
    boolean existsByMaterialCodeAndStatus(String materialCode, String status);
}
