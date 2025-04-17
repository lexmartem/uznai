package com.uznai.service;

import com.uznai.dto.request.LoginRequest;
import com.uznai.dto.request.RegisterRequest;
import com.uznai.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse register(RegisterRequest request);
    JwtAuthResponse login(LoginRequest request);
    JwtAuthResponse refreshToken(String refreshToken);
    void logout(String token);
} 