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

import java.util.UUID;

public interface QuizService {
    Page<QuizSummaryResponse> getUserQuizzes(User user, Pageable pageable);
    Page<QuizSummaryResponse> getCreatedQuizzes(User user, Pageable pageable);
    Page<QuizSummaryResponse> getCollaboratedQuizzes(User user, Pageable pageable);
    Page<QuizSummaryResponse> getPublicQuizzes(Pageable pageable);
    QuizResponse getQuizById(UUID quizId, User user);
    QuizResponse createQuiz(CreateQuizRequest request, User user);
    QuizResponse updateQuiz(UUID quizId, UpdateQuizRequest request, User user);
    void deleteQuiz(UUID quizId, User user);
}

