package com.uznai.service;

import com.uznai.dto.request.StartQuizSessionRequest;
import com.uznai.dto.request.SubmitAnswerRequest;
import com.uznai.dto.response.QuizQuestionResponse;
import com.uznai.dto.response.QuizSessionResponse;
import com.uznai.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface QuizSessionService {
    QuizSessionResponse startSession(StartQuizSessionRequest request, UserPrincipal userPrincipal);
    
    QuizSessionResponse getSession(UUID sessionId, UserPrincipal userPrincipal);
    
    Page<QuizQuestionResponse> getSessionQuestions(UUID sessionId, UserPrincipal userPrincipal, Pageable pageable);
    
    void submitAnswer(UUID sessionId, UUID questionId, SubmitAnswerRequest request, UserPrincipal userPrincipal);
    
    QuizSessionResponse completeSession(UUID sessionId, UserPrincipal userPrincipal);
    
    void expireSession(UUID sessionId, UserPrincipal userPrincipal);
    
    Page<QuizSessionResponse> getUserSessions(UserPrincipal userPrincipal, Pageable pageable);
} 