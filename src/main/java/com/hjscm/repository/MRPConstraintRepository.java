package com.hjscm.repository;

import com.hjscm.entity.MRPConstraint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * MRP约束Repository
 */
@Repository
public interface MRPConstraintRepository extends JpaRepository<MRPConstraint, String> {
    
    Optional<MRPConstraint> findByMaterialId(String materialId);
    
    List<MRPConstraint> findByMaterialIdIn(List<String> materialIds);
    
    Optional<MRPConstraint> findByMaterialIdAndBatchTrackingRequiredTrue(
        String materialId
    );
}
