package com.uznai.service.impl;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.request.UpdateQuestionRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.entity.Question;
import com.uznai.entity.Quiz;
import com.uznai.entity.User;
import com.uznai.entity.enums.QuestionType;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.QuestionMapper;
import com.uznai.repository.QuestionRepository;
import com.uznai.repository.QuizRepository;
import com.uznai.service.QuestionService;
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
    private final QuestionMapper questionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByQuizId(UUID quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user) && !quiz.isPublic() && 
            !quiz.getCollaborators().stream().anyMatch(c -> c.getUser().equals(user))) {
            throw new UnauthorizedException("You don't have access to this quiz");
        }

        return questionRepository.findByQuizOrderByOrderIndex(quiz).stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        if (!quiz.getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can add questions");
        }

        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOrderIndex(request.getOrderIndex());
        question.setQuiz(quiz);
        question.setVersion(1);

        Question savedQuestion = questionRepository.save(question);
        return questionMapper.toResponse(savedQuestion);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, User user) {
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
        question.setVersion(question.getVersion() + 1);

        Question updatedQuestion = questionRepository.save(question);
        return questionMapper.toResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID questionId, User user) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));

        if (!question.getQuiz().getCreator().equals(user)) {
            throw new UnauthorizedException("Only quiz creator can delete questions");
        }

        questionRepository.delete(question);
    }
} 