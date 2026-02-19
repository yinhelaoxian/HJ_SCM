package com.hjscm.repository;

import com.hjscm.entity.InTransitOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 在途订单仓储接口
 * 
 * 功能：
 * - 查询在途订单
 * - 按预计到货日期筛选
 * - 按物料和工厂筛选
 */
@Repository
public interface InTransitOrderRepository extends JpaRepository<InTransitOrderEntity, String> {

    /**
     * 根据物料编码查询在途订单
     */
    List<InTransitOrderEntity> findByMaterialCode(String materialCode);

    /**
     * 根据工厂查询在途订单
     */
    List<InTransitOrderEntity> findByPlantCode(String plantCode);

    /**
     * 根据物料和工厂查询在途订单
     */
    List<InTransitOrderEntity> findByMaterialCodeAndPlantCode(
        String materialCode, String plantCode);

    /**
     * 查询指定日期范围内预计到货的在途订单
     */
    @Query("SELECT i FROM InTransitOrderEntity i WHERE i.estimatedArrivalDate BETWEEN :startDate AND :endDate")
    List<InTransitOrderEntity> findByArrivalDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * 查询未到货的订单
     */
    @Query("SELECT i FROM InTransitOrderEntity i WHERE i.actualReceiptDate IS NULL")
    List<InTransitOrderEntity> findUnreceivedOrders();

    /**
     * 根据供应商查询在途订单
     */
    List<InTransitOrderEntity> findBySupplierCode(String supplierCode);
}
