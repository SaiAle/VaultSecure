package com.vaultsecure.secret;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "secrets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Secret {

    @Id
    private UUID id;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(length = 64)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedValue;

    @Column(nullable = false, length = 64)
    private String iv;

    @Column(nullable = false, length = 64)
    private String salt;

    @Column(nullable = false, length = 64)
    private String ownerUsername;

    @Column(nullable = false)
    private int version;

    @Column(nullable = false)
    private boolean active;

    private Instant expiresAt;
    private Instant rotatedAt;

    @Column(updatable = false)
    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    void prePersist() { createdAt = updatedAt = Instant.now(); version = 1; active = true; }

    @PreUpdate
    void preUpdate() { updatedAt = Instant.now(); }
}
