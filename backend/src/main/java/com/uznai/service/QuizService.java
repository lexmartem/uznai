package com.uznai.service;

import com.uznai.dto.request.CreateQuizRequest;
import com.uznai.dto.request.UpdateQuizRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.dto.response.QuizSummaryResponse;
import com.uznai.entity.Quiz;
import com.uznai.entity.User;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.QuizMapper;
import com.uznai.repository.QuizRepository;
import com.uznai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uznai.security.UserPrincipal;

import java.util.UUID;

public interface QuizService {
    Page<QuizSummaryResponse> getUserQuizzes(UserPrincipal userPrincipal, Pageable pageable);
    Page<QuizSummaryResponse> getCreatedQuizzes(UserPrincipal userPrincipal, Pageable pageable);
    Page<QuizSummaryResponse> getCollaboratedQuizzes(UserPrincipal userPrincipal, Pageable pageable);
    Page<QuizSummaryResponse> getPublicQuizzes(Pageable pageable);
    Page<QuizSummaryResponse> getPublicQuizzesByUser(UUID userId, Pageable pageable);
    QuizResponse getQuizById(UUID quizId, UserPrincipal userPrincipal);
    QuizResponse createQuiz(CreateQuizRequest request, UserPrincipal userPrincipal);
    QuizResponse updateQuiz(UUID quizId, UpdateQuizRequest request, UserPrincipal userPrincipal);
    void deleteQuiz(UUID quizId, UserPrincipal userPrincipal);
}

