package com.vaultsecure.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${vault.jwt.secret}")
    private String jwtSecret;

    @Value("${vault.jwt.expiry-ms:3600000}")
    private long expiryMs;

    private Key signingKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generate(String username, Map<String, Object> claims) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiryMs))
            .signWith(signingKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(signingKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public boolean isValid(String token) {
        try { parse(token); return true; }
        catch (JwtException | IllegalArgumentException e) { return false; }
    }

    public String getUsername(String token) {
        return parse(token).getSubject();
    }
}
