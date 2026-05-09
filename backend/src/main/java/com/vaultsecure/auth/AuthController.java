package com.vaultsecure.auth;

import com.vaultsecure.dto.AuthRequest;
import com.vaultsecure.dto.AuthResponse;
import com.vaultsecure.dto.TotpSetupResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("X-Refresh-Token") String token) {
        return ResponseEntity.ok(authService.refresh(token));
    }

    @PostMapping("/totp/setup")
    public ResponseEntity<TotpSetupResponse> setupTotp(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(authService.setupTotp(user.getUsername()));
    }

    @PostMapping("/totp/verify")
    public ResponseEntity<Void> verifyTotp(@AuthenticationPrincipal UserDetails user,
                                            @RequestParam String code) {
        authService.verifyAndEnableTotp(user.getUsername(), code);
        return ResponseEntity.ok().build();
    }
}
