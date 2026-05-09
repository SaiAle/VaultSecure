package com.vaultsecure.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository repo;

    public void log(String eventType, String username, String description) {
        AuditLog entry = AuditLog.builder()
            .eventType(eventType)
            .username(username)
            .description(description)
            .build();
        repo.save(entry);
    }

    public Page<AuditLog> getLogs(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return (username != null)
            ? repo.findByUsername(username, pageable)
            : repo.findAll(pageable);
    }
}
