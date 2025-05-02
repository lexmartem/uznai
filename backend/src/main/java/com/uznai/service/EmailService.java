package com.uznai.service;

public interface EmailService {
    void sendPasswordResetEmail(String email, String token);
    void sendEmailVerificationEmail(String email, String token);
    void sendWelcomeEmail(String email, String username);
} 