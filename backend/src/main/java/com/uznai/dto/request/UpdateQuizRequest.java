package com.uznai.dto.request;

import lombok.Data;

@Data
public class UpdateQuizRequest {
    private String title;
    private String description;
    private Boolean isPublic;
    private Integer version;
} 