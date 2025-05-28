package com.uznai.dto.request;

import com.uznai.entity.QuizChange.ChangeType;
import lombok.Data;

@Data
public class QuizChangeRequest {
    private ChangeType changeType;
    private String changeData;
    private Long version;
} 