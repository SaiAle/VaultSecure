package com.vaultsecure.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vault_users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VaultUser {

    @Id
    private UUID id;

    @Column(unique = true, nullable = false, length = 64)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 32)
    private String role;

    private String totpSecret;
    private boolean totpEnabled;

    @Column(updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() { createdAt = Instant.now(); }
}
