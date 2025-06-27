package com.uznai.service.impl;

import com.uznai.dto.request.CreateAnswerRequest;
import com.uznai.dto.request.UpdateAnswerRequest;
import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.request.UpdateQuestionRequest;
import com.uznai.dto.response.AnswerResponse;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.entity.Answer;
import com.uznai.entity.Question;
import com.uznai.entity.Quiz;
import com.uznai.entity.User;
import com.uznai.entity.enums.QuestionType;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.AnswerMapper;
import com.uznai.mapper.QuestionMapper;
import com.uznai.repository.AnswerRepository;
import com.uznai.repository.QuestionRepository;
import com.uznai.repository.QuizRepository;
import com.uznai.repository.UserRepository;
import com.uznai.service.QuestionService;
import com.uznai.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuestionMapper questionMapper;
    private final AnswerRepository answerRepository;
    private final AnswerMapper answerMapper;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByQuizId(UUID quizId, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user) && !quiz.isPublic()) {
            throw new UnauthorizedException("You don't have access to this quiz");
        }

        return questionRepository.findByQuizOrderByOrderIndex(quiz).stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can add questions");
        }

        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOrderIndex(request.getOrderIndex());
        question.setImageUrl(request.getImageUrl());
        question.setCodeSnippet(request.getCodeSnippet());
        question.setExplanation(request.getExplanation());
        question.setQuiz(quiz);
        question.setVersion(1);

        Question savedQuestion = questionRepository.save(question);
        return questionMapper.toResponse(savedQuestion);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));

        if (!question.getQuiz().getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can update questions");
        }

        if (!question.getVersion().equals(request.getVersion())) {
            throw new UnauthorizedException("Question has been modified by another user");
        }

        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOrderIndex(request.getOrderIndex());
        question.setImageUrl(request.getImageUrl());
        question.setCodeSnippet(request.getCodeSnippet());
        question.setExplanation(request.getExplanation());
        question.setVersion(question.getVersion() + 1);

        Question updatedQuestion = questionRepository.save(question);
        return questionMapper.toResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID questionId, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));

        if (!question.getQuiz().getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can delete questions");
        }

        questionRepository.delete(question);
    }

    @Override
    @Transactional
    public AnswerResponse createAnswer(UUID quizId, UUID questionId, CreateAnswerRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));
        if (!question.getQuiz().getId().equals(quiz.getId())) {
            throw new NotFoundException("Question does not belong to the specified quiz");
        }
        if (!quiz.getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can add answers");
        }
        Answer answer = answerMapper.toEntity(request);
        answer.setQuestion(question);
        System.out.println("[DEBUG] Mapped isCorrect: " + answer.isCorrect());
        Answer savedAnswer = answerRepository.save(answer);
        return answerMapper.toResponse(savedAnswer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnswerResponse> getAnswersByQuestionId(UUID questionId, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));

        if (!question.getQuiz().getCreator().equals(user) && !question.getQuiz().isPublic()) {
            throw new UnauthorizedException("You don't have access to this quiz");
        }

        return answerRepository.findByQuestionOrderByOrderIndex(question).stream()
                .map(answerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAnswer(UUID answerId, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new NotFoundException("Answer not found"));

        if (!answer.getQuestion().getQuiz().getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can delete answers");
        }

        answerRepository.delete(answer);
    }

    @Override
    @Transactional
    public AnswerResponse updateAnswer(UUID answerId, UpdateAnswerRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new NotFoundException("Answer not found"));

        if (!answer.getQuestion().getQuiz().getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can update answers");
        }

        if (!answer.getVersion().equals(request.getVersion())) {
            throw new UnauthorizedException("Answer has been modified by another user");
        }

        answer.setAnswerText(request.getAnswerText());
        answer.setCorrect(request.getCorrect());
        answer.setOrderIndex(request.getOrderIndex());
        answer.setImageUrl(request.getImageUrl());
        answer.setCodeSnippet(request.getCodeSnippet());
        answer.setExplanation(request.getExplanation());
        answer.setVersion(answer.getVersion() + 1);

        Answer updatedAnswer = answerRepository.save(answer);
        return answerMapper.toResponse(updatedAnswer);
    }
} 