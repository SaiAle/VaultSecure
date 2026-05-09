package com.vaultsecure.dto;
public record AuthResponse(String token, String refreshToken, String username, String role, boolean totpEnabled) {}
