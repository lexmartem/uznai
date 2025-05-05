package com.uznai.mapper;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {AnswerMapper.class})
public interface QuestionMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "version", ignore = true)
    Question toEntity(CreateQuestionRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "questionText", source = "questionText")
    @Mapping(target = "questionType", source = "questionType")
    @Mapping(target = "orderIndex", source = "orderIndex")
    @Mapping(target = "version", source = "version")
    QuestionResponse toResponse(Question question);
} 