package com.uznai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private boolean emailVerified;
    private String bio;
    private String avatarUrl;
    private Set<String> roles;
} 