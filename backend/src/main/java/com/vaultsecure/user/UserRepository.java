package com.vaultsecure.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<VaultUser, UUID> {
    Optional<VaultUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
