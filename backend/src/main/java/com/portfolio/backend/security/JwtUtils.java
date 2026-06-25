package com.portfolio.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    // In a real app, inject this from properties
    private final String SECRET = "thisIsAVeryLongSecretKeyForJwtAuthenticationWhichNeedsToBeAtLeast256BitsLong!";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    
    public String generateToken() {
        return Jwts.builder()
                .subject("guest")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(key)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
