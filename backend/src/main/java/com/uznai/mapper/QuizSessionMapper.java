package com.uznai.mapper;

import com.uznai.dto.response.QuizSessionResponse;
import com.uznai.entity.QuizSession;
import com.uznai.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.uznai.repository.SessionAnswerRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class QuizSessionMapper {
    @Autowired
    protected SessionAnswerRepository sessionAnswerRepository;

    @Mapping(target = "quiz", source = "quiz")
    @Mapping(target = "questionCount", expression = "java(session.getQuiz().getQuestions().size())")
    @Mapping(target = "answeredCount", expression = "java((int) sessionAnswerRepository.countBySession(session))")
    public abstract QuizSessionResponse toResponse(QuizSession session);

    public abstract Set<String> map(Set<Role> roles);
    public String map(Role role) {
        return role == null ? null : role.getName();
    }
} 