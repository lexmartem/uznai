package com.uznai.service.impl;

import com.uznai.service.JwtService;
import com.uznai.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtTokenProvider tokenProvider;
    private final ConcurrentHashMap<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    @Override
    public String generateToken(Authentication authentication) {
        return tokenProvider.generateToken(authentication);
    }

    @Override
    public String generateRefreshToken(Authentication authentication) {
        // Generate a refresh token with longer expiration
        return tokenProvider.generateToken(authentication);
    }

    @Override
    public boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) {
            return false;
        }
        return tokenProvider.validateToken(token);
    }

    @Override
    public String getUserIdFromToken(String token) {
        return tokenProvider.getUserIdFromJWT(token);
    }

    @Override
    public void blacklistToken(String token) {
        Date expirationDate = new Date(tokenProvider.getExpirationTimeFromToken(token));
        blacklistedTokens.put(token, expirationDate);
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        Date expirationDate = blacklistedTokens.get(token);
        if (expirationDate == null) {
            return false;
        }
        if (expirationDate.before(new Date())) {
            blacklistedTokens.remove(token);
            return false;
        }
        return true;
    }

    @Override
    public String getUsernameFromToken(String token) {
        return tokenProvider.getUsernameFromToken(token);
    }

    @Override
    public long getExpirationTimeFromToken(String token) {
        return tokenProvider.getExpirationTimeFromToken(token);
    }
} 