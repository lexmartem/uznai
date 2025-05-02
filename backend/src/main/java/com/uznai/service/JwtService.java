package com.uznai.service;

import org.springframework.security.core.Authentication;

public interface JwtService {
    String generateToken(Authentication authentication);
    String generateRefreshToken(Authentication authentication);
    boolean validateToken(String token);
    String getUserIdFromToken(String token);
    void blacklistToken(String token);
    boolean isTokenBlacklisted(String token);
    String getUsernameFromToken(String token);
    long getExpirationTimeFromToken(String token);
} 