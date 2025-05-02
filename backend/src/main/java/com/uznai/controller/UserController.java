package com.uznai.controller;

import com.uznai.dto.request.AvatarUpdateRequest;
import com.uznai.dto.request.BioUpdateRequest;
import com.uznai.dto.request.EmailUpdateRequest;
import com.uznai.dto.request.PasswordChangeRequest;
import com.uznai.dto.response.UserResponse;
import com.uznai.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserResponse userResponse) {
        return ResponseEntity.ok(userService.updateCurrentUser(userDetails.getUsername(), userResponse));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/email")
    public ResponseEntity<Void> updateEmail(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EmailUpdateRequest request) {
        userService.updateEmail(userDetails.getUsername(), request.getNewEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/bio")
    public ResponseEntity<Void> updateBio(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BioUpdateRequest request) {
        userService.updateBio(userDetails.getUsername(), request.getBio());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<Void> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AvatarUpdateRequest request) {
        userService.updateAvatar(userDetails.getUsername(), request.getAvatarUrl());
        return ResponseEntity.noContent().build();
    }
} 