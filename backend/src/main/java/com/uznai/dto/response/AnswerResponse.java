package com.uznai.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AnswerResponse {
    private UUID id;
    private String answerText;
    private boolean correct;
    private Integer orderIndex;
    private String imageUrl;
    private String codeSnippet;
    private String explanation;
    private Integer version;
} 