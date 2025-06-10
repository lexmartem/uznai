package com.uznai.mapper;

import com.uznai.dto.response.QuizQuestionResponse;
import com.uznai.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuizQuestionMapper {
    @Mapping(target = "userAnswers", ignore = true)
    QuizQuestionResponse toResponse(Question question);
} 