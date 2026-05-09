package com.vaultsecure.crypto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.util.Base64;

@Service
public class KeyDerivationService {

    @Value("${vault.master-password}")
    private String masterPassword;

    private static final int ITERATIONS = 310_000;
    private static final int KEY_LENGTH = 256;

    public byte[] deriveKey(String salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(
            masterPassword.toCharArray(),
            Base64.getDecoder().decode(salt),
            ITERATIONS,
            KEY_LENGTH
        );
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        return factory.generateSecret(spec).getEncoded();
    }

    public String generateSalt() {
        byte[] salt = new byte[16];
        new java.security.SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
}
