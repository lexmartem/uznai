package com.uznai.service.impl;

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
import com.uznai.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizMapper quizMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<QuizSummaryResponse> getUserQuizzes(User user, Pageable pageable) {
        return quizRepository.findUserQuizzes(user, pageable)
                .map(quizMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizSummaryResponse> getCreatedQuizzes(User user, Pageable pageable) {
        return quizRepository.findByCreator(user, pageable)
                .map(quizMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizSummaryResponse> getCollaboratedQuizzes(User user, Pageable pageable) {
        return quizRepository.findCollaboratedQuizzes(user, pageable)
                .map(quizMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizSummaryResponse> getPublicQuizzes(Pageable pageable) {
        return quizRepository.findByIsPublic(true, pageable)
                .map(quizMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizResponse getQuizById(UUID quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user) && !quiz.isPublic() && 
            !quiz.getCollaborators().stream().anyMatch(c -> c.getUser().equals(user))) {
            throw new UnauthorizedException("You don't have access to this quiz");
        }

        return quizMapper.toResponse(quiz);
    }

    @Override
    @Transactional
    public QuizResponse createQuiz(CreateQuizRequest request, User user) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (quizRepository.existsByTitleAndCreator(request.getTitle(), existingUser)) {
            throw new IllegalArgumentException("A quiz with this title already exists");
        }

        Quiz quiz = quizMapper.toEntity(request);
        quiz.setCreator(existingUser);
        quiz.setVersion(1);

        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    @Override
    @Transactional
    public QuizResponse updateQuiz(UUID quizId, UpdateQuizRequest request, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user)) {
            throw new UnauthorizedException("Only the creator can update the quiz");
        }

        if (!quiz.getVersion().equals(request.getVersion())) {
            throw new IllegalArgumentException("Quiz has been modified by another user");
        }

        quizMapper.updateEntity(request, quiz);
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    @Override
    @Transactional
    public void deleteQuiz(UUID quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user)) {
            throw new UnauthorizedException("Only the creator can delete the quiz");
        }

        quizRepository.delete(quiz);
    }
} 