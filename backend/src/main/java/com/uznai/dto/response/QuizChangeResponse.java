package com.uznai.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class QuizChangeResponse {
    private UUID id;
    private String changeType;
    private String changeData;
    private LocalDateTime createdAt;
    private UserResponse user;
} 