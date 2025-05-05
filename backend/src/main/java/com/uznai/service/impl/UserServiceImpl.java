package com.uznai.service.impl;

import com.uznai.dto.request.PasswordChangeRequest;
import com.uznai.dto.response.UserResponse;
import com.uznai.entity.EmailVerificationToken;
import com.uznai.entity.User;
import com.uznai.exception.ResourceNotFoundException;
import com.uznai.repository.EmailVerificationTokenRepository;
import com.uznai.repository.UserRepository;
import com.uznai.service.EmailService;
import com.uznai.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUser(String username, UserResponse userResponse) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        if (userResponse.getUsername() != null && !userResponse.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userResponse.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(userResponse.getUsername());
        }

        if (userResponse.getEmail() != null && !userResponse.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userResponse.getEmail())) {
                throw new IllegalArgumentException("Email is already in use");
            }
            user.setEmail(userResponse.getEmail());
            user.setEmailVerified(false);
            sendVerificationEmail(user);
        }

        if (userResponse.getBio() != null) {
            user.setBio(userResponse.getBio());
        }

        if (userResponse.getAvatarUrl() != null) {
            user.setAvatarUrl(userResponse.getAvatarUrl());
        }

        user.setUpdatedAt(ZonedDateTime.now());
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(String username, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateEmail(String username, String newEmail) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        if (userRepository.existsByEmail(newEmail)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        user.setEmail(newEmail);
        user.setEmailVerified(false);
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);

        sendVerificationEmail(user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email verification token"));

        if (verificationToken.isExpired()) {
            emailVerificationTokenRepository.delete(verificationToken);
            throw new IllegalArgumentException("Email verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);

        emailVerificationTokenRepository.delete(verificationToken);
    }

    @Override
    @Transactional
    public void updateBio(String username, String bio) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        user.setBio(bio);
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateAvatar(String username, String avatarUrl) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        user.setAvatarUrl(avatarUrl);
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);
    }

    private void sendVerificationEmail(User user) {
        // Delete any existing tokens for this user
        emailVerificationTokenRepository.deleteByUserId(user.getId());

        // Create new token
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpirationDate(ZonedDateTime.now().plusHours(24)); // 24 hours expiration

        emailVerificationTokenRepository.save(token);

        // Send email
        emailService.sendEmailVerificationEmail(user.getEmail(), token.getToken());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .emailVerified(user.isEmailVerified())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet()))
                .build();
    }
} 