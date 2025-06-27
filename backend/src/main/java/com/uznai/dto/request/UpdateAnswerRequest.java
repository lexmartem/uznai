package com.uznai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAnswerRequest {
    @NotBlank(message = "Answer text is required")
    private String answerText;
    
    @NotNull(message = "Correct status is required")
    private Boolean correct;
    
    @NotNull(message = "Order index is required")
    private Integer orderIndex;
    
    private String imageUrl;
    
    private String codeSnippet;
    
    private String explanation;
    
    @NotNull(message = "Version is required")
    private Integer version;
} 