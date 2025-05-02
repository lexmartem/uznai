package com.uznai.service;

import com.uznai.dto.request.PasswordChangeRequest;
import com.uznai.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUser(String username);
    UserResponse updateCurrentUser(String username, UserResponse userResponse);
    void changePassword(String username, PasswordChangeRequest request);
    void updateEmail(String username, String newEmail);
    void verifyEmail(String token);
    void updateBio(String username, String bio);
    void updateAvatar(String username, String avatarUrl);
} 