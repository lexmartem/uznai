package com.uznai.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartQuizSessionRequest {
    @NotNull(message = "Quiz ID is required")
    private String quizId;
} 