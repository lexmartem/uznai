package com.uznai.dto.request;

import com.uznai.entity.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateQuestionRequest {
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotNull(message = "Question type is required")
    private QuestionType questionType;
    
    @NotNull(message = "Order index is required")
    private Integer orderIndex;
    
    private String imageUrl;
    
    private String codeSnippet;
    
    private String explanation;
    
    private List<CreateAnswerRequest> answers;
} 