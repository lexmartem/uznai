package com.uznai.service;

import com.uznai.dto.response.QuizResultResponse;
import com.uznai.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface QuizResultService {
    QuizResultResponse getResult(UUID resultId, UserPrincipal userPrincipal);
    
    Page<QuizResultResponse> getUserResults(UserPrincipal userPrincipal, Pageable pageable);
    
    Page<QuizResultResponse> getUserResultsForQuiz(UUID quizId, UserPrincipal userPrincipal, Pageable pageable);
    
    QuizResultResponse getLatestResultForQuiz(UUID quizId, UserPrincipal userPrincipal);
} 