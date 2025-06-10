package com.uznai.mapper;

import com.uznai.dto.response.AnswerResultResponse;
import com.uznai.entity.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnswerResultMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "answerText", source = "answerText")
    @Mapping(target = "isCorrect", source = "correct")
    AnswerResultResponse toResponse(Answer answer);
} 