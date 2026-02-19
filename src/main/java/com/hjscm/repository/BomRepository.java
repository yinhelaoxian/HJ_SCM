package com.hjscm.repository;

import com.hjscm.entity.BomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BOM 物料清单仓储接口
 * 
 * 功能：
 * - 查询 BOM 记录
 * - 按父级物料查询子级
 * - 支持多级 BOM 查询
 */
@Repository
public interface BomRepository extends JpaRepository<BomEntity, String> {

    /**
     * 根据父级物料编码查询子项
     */
    List<BomEntity> findByParentMaterialCode(String parentMaterialCode);

    /**
     * 根据子级物料编码查询使用它的父级
     */
    List<BomEntity> findByChildMaterialCode(String childMaterialCode);

    /**
     * 根据工厂查询 BOM
     */
    List<BomEntity> findByPlantCode(String plantCode);

    /**
     * 根据父级物料和工厂查询 BOM
     */
    List<BomEntity> findByParentMaterialCodeAndPlantCode(
        String parentMaterialCode, String plantCode);

    /**
     * 查询指定层级的 BOM
     */
    @Query("SELECT b FROM BomEntity b WHERE b.bomLevel = :level")
    List<BomEntity> findByBomLevel(@Param("level") Integer level);

    /**
     * 查询有效的 BOM（未失效的）
     */
    @Query("SELECT b FROM BomEntity b WHERE b.isActive = true")
    List<BomEntity> findActiveBoms();

    /**
     * 检查 BOM 是否存在
     */
    boolean existsByParentMaterialCodeAndChildMaterialCode(
        String parentMaterialCode, String childMaterialCode);
}
