package com.uznai.mapper;

import com.uznai.dto.response.QuizResultResponse;
import com.uznai.entity.QuizResult;
import com.uznai.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {QuestionResultMapper.class})
public interface QuizResultMapper {
    @Mapping(target = "quiz", source = "quiz")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "user.roles", source = "user.roles", qualifiedByName = "mapRoles")
    @Mapping(target = "quiz.creator.roles", source = "quiz.creator.roles", qualifiedByName = "mapRoles")
    QuizResultResponse toResponse(QuizResult result);

    @Named("mapRoles")
    default Set<String> mapRoles(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
} 