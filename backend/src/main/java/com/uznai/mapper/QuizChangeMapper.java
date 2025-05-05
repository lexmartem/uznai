package com.uznai.mapper;

import com.uznai.dto.response.QuizChangeResponse;
import com.uznai.entity.QuizChange;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface QuizChangeMapper {
    QuizChangeResponse toResponse(QuizChange change);
} 