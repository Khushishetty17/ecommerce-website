package com.ecommerce.repositories;

import java.util.Optional;

import com.ecommerce.models.Role;
import com.ecommerce.models.Role.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
    
    // Add this method to fix the error in TestAuthController
    Boolean existsByName(ERole name);
} 