package com.uznai.service.impl;

import com.uznai.dto.request.StartQuizSessionRequest;
import com.uznai.dto.request.SubmitAnswerRequest;
import com.uznai.dto.response.QuizQuestionResponse;
import com.uznai.dto.response.QuizSessionResponse;
import com.uznai.entity.*;
import com.uznai.entity.enums.SessionStatus;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.QuizSessionMapper;
import com.uznai.mapper.QuizQuestionMapper;
import com.uznai.repository.*;
import com.uznai.security.UserPrincipal;
import com.uznai.service.QuizSessionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizSessionServiceImpl implements QuizSessionService {

    private static final Logger log = LoggerFactory.getLogger(QuizSessionServiceImpl.class);

    private final QuizSessionRepository quizSessionRepository;
    private final SessionAnswerRepository sessionAnswerRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final QuizSessionMapper quizSessionMapper;
    private final QuizQuestionMapper quizQuestionMapper;
    private final AnswerRepository answerRepository;
    private final QuizResultRepository quizResultRepository;

    @Override
    @Transactional
    public QuizSessionResponse startSession(StartQuizSessionRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        Quiz quiz = quizRepository.findById(UUID.fromString(request.getQuizId()))
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        // Check if user has access to the quiz
        if (!quiz.getCreator().equals(user) && !quiz.isPublic()) {
            throw new UnauthorizedException("You don't have access to this quiz");
        }

        // Expire any existing active session for this quiz/user
        quizSessionRepository.findActiveSessionForUserAndQuiz(user, SessionStatus.ACTIVE, quiz.getId())
                .ifPresent(session -> {
                    session.setStatus(SessionStatus.EXPIRED);
                    quizSessionRepository.save(session);
                });

        QuizSession session = new QuizSession();
        session.setQuiz(quiz);
        session.setUser(user);
        session.setStartedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(24)); // 24-hour expiration
        session.setStatus(SessionStatus.ACTIVE);

        session = quizSessionRepository.save(session);
        return quizSessionMapper.toResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizSessionResponse getSession(UUID sessionId, UserPrincipal userPrincipal) {
        QuizSession session = quizSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this session");
        }

        return quizSessionMapper.toResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizQuestionResponse> getSessionQuestions(UUID sessionId, UserPrincipal userPrincipal, Pageable pageable) {
        QuizSession session = quizSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this session");
        }

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new UnauthorizedException("This session is no longer active");
        }

        return questionRepository.findByQuizOrderByOrderIndex(session.getQuiz(), pageable)
                .map(question -> {
                    QuizQuestionResponse response = quizQuestionMapper.toResponse(question);
                    sessionAnswerRepository.findBySessionAndQuestionId(session, question.getId())
                            .ifPresent(answer -> {
                                if (answer.getSelectedAnswerIds() != null) {
                                    response.setUserAnswers(Arrays.asList(answer.getSelectedAnswerIds()));
                                } else {
                                    response.setUserAnswers(List.of());
                                }
                            });
                    return response;
                });
    }

    @Override
    @Transactional
    public void submitAnswer(UUID sessionId, UUID questionId, SubmitAnswerRequest request, UserPrincipal userPrincipal) {
        QuizSession session = quizSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this session");
        }

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new UnauthorizedException("This session is no longer active");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));

        if (!question.getQuiz().getId().equals(session.getQuiz().getId())) {
            throw new UnauthorizedException("Question does not belong to this quiz");
        }

        SessionAnswer answer = sessionAnswerRepository.findBySessionAndQuestionId(session, questionId)
                .orElseGet(() -> {
                    SessionAnswer newAnswer = new SessionAnswer();
                    newAnswer.setSession(session);
                    newAnswer.setQuestion(question);
                    return newAnswer;
                });

        if (request.getSelectedAnswerIds() != null) {
            answer.setSelectedAnswerIds(request.getSelectedAnswerIds().stream()
                    .map(UUID::fromString)
                    .toArray(UUID[]::new));
        } else {
            answer.setSelectedAnswerIds(null);
        }

        if (request.getTextAnswer() != null) {
            answer.setTextAnswer(request.getTextAnswer());
        } else {
            answer.setTextAnswer(null);
        }

        sessionAnswerRepository.save(answer);
        log.info("Saved SessionAnswer: sessionId={}, questionId={}, selectedAnswerIds={}, textAnswer={}",
            sessionId, questionId, request.getSelectedAnswerIds(), request.getTextAnswer());
    }

    @Override
    @Transactional
    public QuizSessionResponse completeSession(UUID sessionId, UserPrincipal userPrincipal) {
        QuizSession session = quizSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this session");
        }

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new UnauthorizedException("This session is no longer active");
        }

        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        session = quizSessionRepository.save(session);

        // --- Create QuizResult ---
        Quiz quiz = session.getQuiz();
        List<Question> questions = questionRepository.findByQuizOrderByOrderIndex(quiz);
        List<SessionAnswer> sessionAnswers = sessionAnswerRepository.findBySessionOrderByQuestionOrderIndex(session);
        log.info("Found {} SessionAnswers for sessionId={}", sessionAnswers.size(), sessionId);
        for (SessionAnswer sa : sessionAnswers) {
            log.info("SessionAnswer: questionId={}, selectedAnswerIds={}, textAnswer={}",
                sa.getQuestion().getId(), sa.getSelectedAnswerIds(), sa.getTextAnswer());
        }

        int totalQuestions = questions.size();
        int correctCount = 0;

        // --- Per-question results ---
        List<QuestionResult> questionResults = new java.util.ArrayList<>();
        for (Question question : questions) {
            // Find user's answer for this question
            SessionAnswer userAnswer = sessionAnswers.stream()
                .filter(sa -> sa.getQuestion().getId().equals(question.getId()))
                .findFirst().orElse(null);

            List<Answer> correctAnswers = answerRepository.findByQuestionOrderByOrderIndex(question).stream()
                .filter(Answer::isCorrect)
                .toList();

            boolean isCorrect = false;
            if (userAnswer != null) {
                if (question.getQuestionType().name().startsWith("MULTIPLE_CHOICE") || question.getQuestionType().name().equals("TRUE_FALSE")) {
                    if (!correctAnswers.isEmpty() && userAnswer.getSelectedAnswerIds() != null) {
                        java.util.List<java.util.UUID> userSelected = java.util.List.of(userAnswer.getSelectedAnswerIds());
                        java.util.List<java.util.UUID> correctIds = correctAnswers.stream().map(Answer::getId).toList();
                        isCorrect = userSelected.size() == correctIds.size() && userSelected.containsAll(correctIds) && correctIds.containsAll(userSelected);
                    }
                } else if (question.getQuestionType().name().equals("SHORT_ANSWER")) {
                    String userText = userAnswer.getTextAnswer() != null ? userAnswer.getTextAnswer().trim().toLowerCase() : "";
                    String correctText = !correctAnswers.isEmpty() && correctAnswers.get(0).getAnswerText() != null ? correctAnswers.get(0).getAnswerText().trim().toLowerCase() : "";
                    isCorrect = !userText.isEmpty() && userText.equals(correctText);
                }
            }
            if (isCorrect) correctCount++;

            // Create and populate QuestionResult entity
            QuestionResult qr = new QuestionResult();
            qr.setResult(null); // will be set by quizResult.addQuestionResult
            qr.setQuestion(question);
            qr.setIsCorrect(isCorrect);
            qr.setSelectedAnswerIds(userAnswer != null ? userAnswer.getSelectedAnswerIds() : null);
            qr.setTextAnswer(userAnswer != null ? userAnswer.getTextAnswer() : null);
            questionResults.add(qr);
        }

        int timeTakenSeconds = (int) java.time.Duration.between(session.getStartedAt(), session.getCompletedAt()).getSeconds();

        QuizResult quizResult = new QuizResult();
        quizResult.setSession(session);
        quizResult.setQuiz(quiz);
        quizResult.setUser(session.getUser());
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setScore(correctCount);
        quizResult.setTimeTakenSeconds(timeTakenSeconds);
        quizResult.setCompletedAt(session.getCompletedAt());

        // Link and persist all QuestionResults (cascade saves them)
        for (QuestionResult qr : questionResults) {
            quizResult.addQuestionResult(qr); // sets qr.result = quizResult
        }

        quizResultRepository.save(quizResult);
        // --- End QuizResult creation ---

        return quizSessionMapper.toResponse(session);
    }

    @Override
    @Transactional
    public void expireSession(UUID sessionId, UserPrincipal userPrincipal) {
        QuizSession session = quizSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userPrincipal.getId())) {
            throw new UnauthorizedException("You don't have access to this session");
        }

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new UnauthorizedException("This session is no longer active");
        }

        session.setStatus(SessionStatus.EXPIRED);
        quizSessionRepository.save(session);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuizSessionResponse> getUserSessions(UserPrincipal userPrincipal, Pageable pageable) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        return quizSessionRepository.findByUserAndStatus(user, SessionStatus.ACTIVE, pageable)
                .map(quizSessionMapper::toResponse);
    }
} 