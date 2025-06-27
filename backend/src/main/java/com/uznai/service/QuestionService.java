package com.uznai.service;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.request.UpdateQuestionRequest;
import com.uznai.dto.request.CreateAnswerRequest;
import com.uznai.dto.request.UpdateAnswerRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.dto.response.AnswerResponse;
import com.uznai.security.UserPrincipal;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public interface QuestionService {
    List<QuestionResponse> getQuestionsByQuizId(UUID quizId, UserPrincipal userPrincipal);
    QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request, UserPrincipal userPrincipal);
    QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, UserPrincipal userPrincipal);
    void deleteQuestion(UUID questionId, UserPrincipal userPrincipal);
    AnswerResponse createAnswer(UUID quizId, UUID questionId, CreateAnswerRequest request, UserPrincipal userPrincipal);
    AnswerResponse updateAnswer(UUID answerId, UpdateAnswerRequest request, UserPrincipal userPrincipal);
    List<AnswerResponse> getAnswersByQuestionId(UUID questionId, UserPrincipal userPrincipal);
    void deleteAnswer(UUID answerId, UserPrincipal userPrincipal);
} 