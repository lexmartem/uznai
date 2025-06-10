package com.uznai.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Data
public class QuizResultResponse {
    private UUID id;
    private QuizSummaryResponse quiz;
    private UserResponse user;
    private Integer score;
    private Integer percentage;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer timeTakenSeconds;
    private LocalDateTime completedAt;
    private List<QuestionResultResponse> questionResults = new ArrayList<>();
} 