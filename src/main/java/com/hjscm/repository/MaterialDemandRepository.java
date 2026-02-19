package com.hjscm.repository;

import com.hjscm.entity.MaterialDemandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 物料需求仓储接口
 * 
 * 功能：
 * - 查询物料需求记录
 * - 按时间范围筛选
 * - 按物料和工厂筛选
 */
@Repository
public interface MaterialDemandRepository extends JpaRepository<MaterialDemandEntity, String> {

    /**
     * 根据物料编码查询需求
     */
    List<MaterialDemandEntity> findByMaterialCode(String materialCode);

    /**
     * 根据工厂查询需求
     */
    List<MaterialDemandEntity> findByPlantCode(String plantCode);

    /**
     * 根据物料和工厂查询需求
     */
    List<MaterialDemandEntity> findByMaterialCodeAndPlantCode(
        String materialCode, String plantCode);

    /**
     * 查询指定日期范围内的需求
     */
    @Query("SELECT m FROM MaterialDemandEntity m WHERE m.demandDate BETWEEN :startDate AND :endDate")
    List<MaterialDemandEntity> findByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * 查询未完成的需求
     */
    @Query("SELECT m FROM MaterialDemandEntity m WHERE m.fulfilledQuantity < m.requiredQuantity")
    List<MaterialDemandEntity> findUnfulfilledDemands();
}
