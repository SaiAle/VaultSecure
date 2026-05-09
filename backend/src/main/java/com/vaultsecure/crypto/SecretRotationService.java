package com.vaultsecure.crypto;

import com.vaultsecure.audit.AuditService;
import com.vaultsecure.secret.Secret;
import com.vaultsecure.secret.SecretRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SecretRotationService {

    private final SecretRepository repo;
    private final AuditService audit;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void expireSecrets() {
        List<Secret> expired = repo.findExpired(Instant.now());
        for (Secret s : expired) {
            s.setActive(false);
            repo.save(s);
            audit.log("SECRET_EXPIRED", s.getOwnerUsername(), "Secret expired: " + s.getName());
            log.info("Expired secret: {} owned by {}", s.getName(), s.getOwnerUsername());
        }
        if (!expired.isEmpty()) {
            log.info("Expired {} secrets", expired.size());
        }
    }
}
