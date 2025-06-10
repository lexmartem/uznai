package com.uznai.dto.response;

import com.uznai.entity.enums.QuestionType;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QuestionResultResponse {
    private UUID questionId;
    private String questionText;
    private QuestionType questionType;
    private Boolean isCorrect;
    private List<AnswerResultResponse> userAnswers;
    private List<AnswerResponse> correctAnswers;
    private String explanation;
} 