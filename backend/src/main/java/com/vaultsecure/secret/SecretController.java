package com.vaultsecure.secret;

import com.vaultsecure.dto.CreateSecretRequest;
import com.vaultsecure.dto.SecretDto;
import com.vaultsecure.dto.UpdateSecretRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/secrets")
@RequiredArgsConstructor
public class SecretController {

    private final SecretService service;

    @PostMapping
    public ResponseEntity<SecretDto> create(@RequestBody CreateSecretRequest req,
                                             @AuthenticationPrincipal UserDetails user) throws Exception {
        return ResponseEntity.ok(service.create(req, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<SecretDto>> list(@RequestParam(required = false) String category,
                                                 @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(service.list(user.getUsername(), category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SecretDto> get(@PathVariable UUID id,
                                          @AuthenticationPrincipal UserDetails user) throws Exception {
        return ResponseEntity.ok(service.get(id, user.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SecretDto> update(@PathVariable UUID id,
                                             @RequestBody UpdateSecretRequest req,
                                             @AuthenticationPrincipal UserDetails user) throws Exception {
        return ResponseEntity.ok(service.update(id, req.value(), user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                        @AuthenticationPrincipal UserDetails user) {
        service.delete(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
