package com.hjscm.repository;

import com.hjscm.entity.SupplierEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * 供应商Repository
 */
@Repository
public interface SupplierRepository extends JpaRepository<SupplierEntity, String> {
    Optional<SupplierEntity> findByCode(String code);
    Optional<SupplierEntity> findByEmail(String email);
    boolean existsByCode(String code);
}
