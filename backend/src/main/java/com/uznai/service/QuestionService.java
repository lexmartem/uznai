package com.uznai.service;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.request.UpdateQuestionRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.entity.User;

import java.util.List;
import java.util.UUID;

public interface QuestionService {
    List<QuestionResponse> getQuestionsByQuizId(UUID quizId, User user);
    QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request, User user);
    QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, User user);
    void deleteQuestion(UUID questionId, User user);
} 