package com.uznai.mapper;

import com.uznai.dto.request.CreateQuizRequest;
import com.uznai.dto.request.UpdateQuizRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.dto.response.QuizSummaryResponse;
import com.uznai.dto.response.UserResponse;
import com.uznai.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class, QuestionMapper.class})
public abstract class QuizMapper {
    @Autowired
    protected UserMapper userMapper;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "changes", ignore = true)
    @Mapping(target = "version", ignore = true)
    public abstract Quiz toEntity(CreateQuizRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "changes", ignore = true)
    public abstract void updateEntity(UpdateQuizRequest request, @MappingTarget Quiz quiz);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "isPublic", source = "public")
    @Mapping(target = "version", source = "version")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "creator", source = "creator")
    @Mapping(target = "questions", source = "questions")
    public abstract QuizResponse toResponse(Quiz quiz);

    public abstract QuizSummaryResponse toSummaryResponse(Quiz quiz);

    protected ZonedDateTime mapLocalDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atZone(java.time.ZoneId.systemDefault()) : null;
    }
} 