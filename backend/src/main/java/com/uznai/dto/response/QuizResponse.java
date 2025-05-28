package com.uznai.dto.response;

import com.uznai.entity.enums.QuestionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class QuizResponse {
    private UUID id;
    private String title;
    private String description;
    private Boolean isPublic;
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse creator;
    private List<QuestionResponse> questions;
    private List<UserResponse> collaborators;
}
