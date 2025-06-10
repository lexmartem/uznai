package com.uznai.service.impl;

import com.uznai.dto.response.QuizResultResponse;
import com.uznai.entity.*;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.QuizResultMapper;
import com.uznai.repository.*;
import com.uznai.security.UserPrincipal;
import com.uznai.service.QuizResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizResultServiceImpl implements QuizResultService {

    private final QuizResultRepository quizResultRepository;
    private final QuizSessionRepository quizSessionRepository;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuizResultMapper quizResultMapper;

    @Override
    @Transactional(readOnly = true)
    public QuizResultResponse getResult(UUID resultId, UserPrincipal userPrincipal) {
        QuizResult result = quizResultRepository.findById(resultId)
                .orElseThrow(() -> new NotFoundException("Result not found"));

        if (!result.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this result");
        }

        return quizResultMapper.toResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizResultResponse> getUserResults(UserPrincipal userPrincipal, Pageable pageable) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        return quizResultRepository.findByUserOrderByCompletedAtDesc(user, pageable)
                .map(quizResultMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizResultResponse> getUserResultsForQuiz(UUID quizId, UserPrincipal userPrincipal, Pageable pageable) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        return quizResultRepository.findByUserAndQuizOrderByCompletedAtDesc(user, quiz, pageable)
                .map(quizResultMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizResultResponse getLatestResultForQuiz(UUID quizId, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        QuizResult result = quizResultRepository.findFirstByUserAndQuizOrderByCompletedAtDesc(user, quiz)
                .orElseThrow(() -> new NotFoundException("No results found for this quiz"));

        return quizResultMapper.toResponse(result);
    }
} 