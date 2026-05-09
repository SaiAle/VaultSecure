package com.vaultsecure.auth;

import com.vaultsecure.dto.AuthRequest;
import com.vaultsecure.dto.AuthResponse;
import com.vaultsecure.dto.TotpSetupResponse;
import com.vaultsecure.user.VaultUser;
import com.vaultsecure.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;
    private final TOTPService totpService;

    public AuthResponse register(AuthRequest req) {
        if (userRepo.existsByUsername(req.username())) {
            throw new RuntimeException("Username already taken");
        }
        VaultUser user = VaultUser.builder()
            .id(UUID.randomUUID())
            .username(req.username())
            .passwordHash(encoder.encode(req.password()))
            .role("ROLE_USER")
            .totpEnabled(false)
            .build();
        userRepo.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(AuthRequest req) {
        VaultUser user = userRepo.findByUsername(req.username())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return buildResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isValid(refreshToken)) throw new RuntimeException("Invalid refresh token");
        String username = jwtService.getUsername(refreshToken);
        VaultUser user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return buildResponse(user);
    }

    public TotpSetupResponse setupTotp(String username) {
        VaultUser user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        userRepo.save(user);
        try {
            String qrUri = totpService.generateQrUri(secret, username);
            return new TotpSetupResponse(secret, qrUri);
        } catch (Exception e) {
            throw new RuntimeException("QR generation failed", e);
        }
    }

    public void verifyAndEnableTotp(String username, String code) {
        VaultUser user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!totpService.verify(user.getTotpSecret(), code)) {
            throw new RuntimeException("Invalid TOTP code");
        }
        user.setTotpEnabled(true);
        userRepo.save(user);
    }

    private AuthResponse buildResponse(VaultUser user) {
        String token = jwtService.generate(user.getUsername(), Map.of("role", user.getRole()));
        String refresh = jwtService.generate(user.getUsername(), Map.of("type", "refresh"));
        return new AuthResponse(token, refresh, user.getUsername(), user.getRole(), user.isTotpEnabled());
    }
}
