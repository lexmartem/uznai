package com.uznai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AvatarUpdateRequest {
    @NotBlank(message = "Avatar URL is required")
    @Pattern(regexp = "^(https?://).*", message = "Avatar URL must be a valid HTTP(S) URL")
    private String avatarUrl;
} 