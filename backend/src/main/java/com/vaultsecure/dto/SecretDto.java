package com.vaultsecure.dto;
import java.time.Instant;
import java.util.UUID;
public record SecretDto(UUID id, String name, String category, String value,
                        int version, boolean active, Instant expiresAt,
                        Instant createdAt, Instant updatedAt) {}
