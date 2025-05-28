package com.uznai.mapper;

import com.uznai.dto.request.CreateAnswerRequest;
import com.uznai.dto.response.AnswerResponse;
import com.uznai.entity.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(source = "isCorrect", target = "correct")
    Answer toEntity(CreateAnswerRequest request);

    AnswerResponse toResponse(Answer answer);
} 