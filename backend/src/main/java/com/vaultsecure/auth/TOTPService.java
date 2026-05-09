package com.vaultsecure.auth;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.springframework.stereotype.Service;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@Service
public class TOTPService {

    private final DefaultSecretGenerator secretGen = new DefaultSecretGenerator();
    private final QrGenerator qrGen = new ZxingPngQrGenerator();

    public String generateSecret() {
        return secretGen.generate();
    }

    public String generateQrUri(String secret, String username) throws QrGenerationException {
        QrData data = new QrData.Builder()
            .label(username)
            .secret(secret)
            .issuer("VaultSecure")
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();
        byte[] img = qrGen.generate(data);
        return getDataUriForImage(img, qrGen.getImageMimeType());
    }

    public boolean verify(String secret, String code) {
        DefaultCodeGenerator codeGen = new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6);
        DefaultCodeVerifier verifier = new DefaultCodeVerifier(codeGen, new SystemTimeProvider());
        verifier.setAllowedTimePeriodDiscrepancy(1);
        return verifier.isValidCode(secret, code);
    }
}
