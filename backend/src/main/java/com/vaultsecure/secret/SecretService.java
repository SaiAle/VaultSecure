package com.vaultsecure.secret;

import com.vaultsecure.audit.AuditService;
import com.vaultsecure.crypto.EncryptionService;
import com.vaultsecure.crypto.KeyDerivationService;
import com.vaultsecure.dto.CreateSecretRequest;
import com.vaultsecure.dto.SecretDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecretService {

    private final SecretRepository repo;
    private final EncryptionService crypto;
    private final KeyDerivationService kdf;
    private final AuditService audit;

    @Transactional
    public SecretDto create(CreateSecretRequest req, String username) throws Exception {
        String salt = kdf.generateSalt();
        byte[] key = kdf.deriveKey(salt);
        var payload = crypto.encrypt(req.value(), key);

        Secret secret = Secret.builder()
            .id(UUID.randomUUID())
            .name(req.name())
            .category(req.category())
            .encryptedValue(payload.ciphertext())
            .iv(payload.iv())
            .salt(salt)
            .ownerUsername(username)
            .expiresAt(req.expiresAt())
            .build();
        Secret saved = repo.save(secret);
        audit.log("CREATE_SECRET", username, "Created secret: " + req.name());
        return toDto(saved, null);
    }

    public List<SecretDto> list(String username, String category) {
        List<Secret> secrets = (category != null && !category.isBlank())
            ? repo.findByOwnerUsernameAndCategoryAndActiveTrue(username, category)
            : repo.findByOwnerUsernameAndActiveTrue(username);
        return secrets.stream().map(s -> toDto(s, null)).collect(Collectors.toList());
    }

    public SecretDto get(UUID id, String username) throws Exception {
        Secret s = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Secret not found"));
        if (!s.getOwnerUsername().equals(username)) throw new RuntimeException("Access denied");
        byte[] key = kdf.deriveKey(s.getSalt());
        String plain = crypto.decrypt(new EncryptionService.EncryptedPayload(s.getEncryptedValue(), s.getIv()), key);
        audit.log("READ_SECRET", username, "Revealed secret: " + s.getName());
        return toDto(s, plain);
    }

    @Transactional
    public SecretDto update(UUID id, String newValue, String username) throws Exception {
        Secret s = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Secret not found"));
        if (!s.getOwnerUsername().equals(username)) throw new RuntimeException("Access denied");
        String salt = kdf.generateSalt();
        byte[] key = kdf.deriveKey(salt);
        var payload = crypto.encrypt(newValue, key);
        s.setEncryptedValue(payload.ciphertext());
        s.setIv(payload.iv());
        s.setSalt(salt);
        s.setVersion(s.getVersion() + 1);
        s.setRotatedAt(Instant.now());
        Secret saved = repo.save(s);
        audit.log("UPDATE_SECRET", username, "Updated secret: " + s.getName());
        return toDto(saved, null);
    }

    @Transactional
    public void delete(UUID id, String username) {
        Secret s = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Secret not found"));
        if (!s.getOwnerUsername().equals(username)) throw new RuntimeException("Access denied");
        s.setActive(false);
        repo.save(s);
        audit.log("DELETE_SECRET", username, "Deleted secret: " + s.getName());
    }

    private SecretDto toDto(Secret s, String plainValue) {
        return new SecretDto(s.getId(), s.getName(), s.getCategory(),
            plainValue, s.getVersion(), s.isActive(),
            s.getExpiresAt(), s.getCreatedAt(), s.getUpdatedAt());
    }
}
