package com.uznai.service;

import com.uznai.dto.request.PasswordChangeRequest;
import com.uznai.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUser(String username);
    UserResponse updateCurrentUser(String username, UserResponse userResponse);
    void changePassword(String username, PasswordChangeRequest request);
} 