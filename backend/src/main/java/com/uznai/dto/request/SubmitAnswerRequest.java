package com.uznai.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SubmitAnswerRequest {
    private List<String> selectedAnswerIds;
    private String textAnswer;

    public boolean isValid() {
        return (selectedAnswerIds != null && !selectedAnswerIds.isEmpty()) || 
               (textAnswer != null && !textAnswer.trim().isEmpty());
    }
} 