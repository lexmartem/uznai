package com.uznai.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailUpdateRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String newEmail;
} 