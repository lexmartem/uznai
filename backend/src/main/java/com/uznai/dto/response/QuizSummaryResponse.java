package com.uznai.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class QuizSummaryResponse {
    private UUID id;
    private String title;
    private String description;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse creator;
    private Integer questionCount;
    private Integer collaboratorCount;
    private Integer activeUserCount;
} 