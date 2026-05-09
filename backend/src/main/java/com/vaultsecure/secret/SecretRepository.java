package com.vaultsecure.secret;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SecretRepository extends JpaRepository<Secret, UUID> {
    List<Secret> findByOwnerUsernameAndActiveTrue(String owner);
    List<Secret> findByOwnerUsernameAndCategoryAndActiveTrue(String owner, String category);

    @Query("SELECT s FROM Secret s WHERE s.expiresAt IS NOT NULL AND s.expiresAt < :now AND s.active = true")
    List<Secret> findExpired(Instant now);
}
