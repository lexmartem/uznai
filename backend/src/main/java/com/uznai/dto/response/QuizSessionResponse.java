package com.uznai.dto.response;

import com.uznai.entity.enums.SessionStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class QuizSessionResponse {
    private UUID id;
    private QuizSummaryResponse quiz;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    private SessionStatus status;
    private Integer questionCount;
    private Integer answeredCount;
} 