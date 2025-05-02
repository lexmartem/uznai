package com.uznai.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BioUpdateRequest {
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;
} 