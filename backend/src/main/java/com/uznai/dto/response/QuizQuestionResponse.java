package com.uznai.dto.response;

import com.uznai.entity.enums.QuestionType;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QuizQuestionResponse {
    private UUID id;
    private String questionText;
    private QuestionType questionType;
    private Integer orderIndex;
    private String imageUrl;
    private String codeSnippet;
    private List<AnswerResponse> answers;
    private List<UUID> userAnswers;
} 