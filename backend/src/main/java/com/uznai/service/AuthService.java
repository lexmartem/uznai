package com.uznai.service;

import com.uznai.dto.request.LoginRequest;
import com.uznai.dto.request.RegisterRequest;
import com.uznai.dto.response.JwtResponse;
import com.uznai.dto.response.UserResponse;

public interface AuthService {
    JwtResponse register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    JwtResponse refreshToken(String refreshToken);
    void logout(String token);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
} 