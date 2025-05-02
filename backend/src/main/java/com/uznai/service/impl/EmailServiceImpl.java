package com.uznai.service.impl;

import com.uznai.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n"
                + "http://localhost:3000/reset-password?token=" + token + "\n\n"
                + "This link will expire in 24 hours.");

        mailSender.send(message);
        log.info("Password reset email sent to: {}", email);
    }

    @Override
    public void sendEmailVerificationEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verify Your Email");
        message.setText("Please click the link below to verify your email:\n\n"
                + "http://localhost:3000/verify-email?token=" + token + "\n\n"
                + "This link will expire in 24 hours.");

        mailSender.send(message);
        log.info("Email verification sent to: {}", email);
    }

    @Override
    public void sendWelcomeEmail(String email, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Uznai!");
        message.setText("Hello " + username + ",\n\n"
                + "Welcome to Uznai! We're excited to have you on board.\n\n"
                + "Best regards,\n"
                + "The Uznai Team");

        mailSender.send(message);
        log.info("Welcome email sent to: {}", email);
    }
} 