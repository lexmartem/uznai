package com.uznai.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AnswerResultResponse {
    private UUID id;
    private String answerText;
    private Boolean isCorrect;
} 