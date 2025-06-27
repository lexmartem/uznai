package com.uznai.dto.request;

import com.uznai.entity.enums.QuestionType;
import lombok.Data;

@Data
public class UpdateQuestionRequest {
    private String questionText;
    private QuestionType questionType;
    private Integer orderIndex;
    private String imageUrl;
    private String codeSnippet;
    private String explanation;
    private Integer version;
} 