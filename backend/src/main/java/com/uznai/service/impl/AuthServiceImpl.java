package com.uznai.service.impl;

import com.uznai.dto.request.LoginRequest;
import com.uznai.dto.request.PasswordChangeRequest;
import com.uznai.dto.request.RegisterRequest;
import com.uznai.dto.response.JwtResponse;
import com.uznai.dto.response.UserResponse;
import com.uznai.entity.PasswordResetToken;
import com.uznai.entity.Role;
import com.uznai.entity.User;
import com.uznai.exception.ResourceAlreadyExistsException;
import com.uznai.exception.ResourceNotFoundException;
import com.uznai.repository.PasswordResetTokenRepository;
import com.uznai.repository.RoleRepository;
import com.uznai.repository.UserRepository;
import com.uznai.security.JwtTokenProvider;
import com.uznai.service.AuthService;
import com.uznai.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email is already in use");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("User role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles(new HashSet<>(Set.of(userRole)));
        user.setCreatedAt(ZonedDateTime.now());
        user.setUpdatedAt(ZonedDateTime.now());

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return JwtResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .refreshToken(refreshToken)
                .expiresIn(86400000) // 24 hours
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = request.isRememberMe() ? tokenProvider.generateRefreshToken(authentication) : null;

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return JwtResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .refreshToken(refreshToken)
                .expiresIn(86400000) // 24 hours
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    public JwtResponse refreshToken(String refreshToken) {
        if (tokenProvider.validateToken(refreshToken)) {
            String userId = tokenProvider.getUserIdFromJWT(refreshToken);
            User user = userRepository.findById(java.util.UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), null, user.getRoles().stream()
                            .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role.getName()))
                            .collect(Collectors.toList())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            String newRefreshToken = tokenProvider.generateRefreshToken(authentication);

            return JwtResponse.builder()
                    .accessToken(jwt)
                    .tokenType("Bearer")
                    .refreshToken(newRefreshToken)
                    .expiresIn(86400000) // 24 hours
                    .user(mapToUserResponse(user))
                    .build();
        }

        throw new RuntimeException("Invalid refresh token");
    }

    @Override
    public void logout(String token) {
        // In a real implementation, you would blacklist the token
        // For now, we'll just clear the security context
        SecurityContextHolder.clearContext();
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Create new token
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(java.util.UUID.randomUUID().toString());
        token.setExpirationDate(ZonedDateTime.now().plusHours(24)); // 24 hours expiration

        passwordResetTokenRepository.save(token);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Password reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(ZonedDateTime.now());
        userRepository.save(user);

        // Delete the used token
        passwordResetTokenRepository.delete(resetToken);
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
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }
} 