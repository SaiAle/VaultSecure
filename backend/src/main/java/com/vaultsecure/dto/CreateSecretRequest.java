package com.vaultsecure.dto;
import java.time.Instant;
public record CreateSecretRequest(String name, String category, String value, Instant expiresAt) {}
