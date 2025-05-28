package com.uznai.service;

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
import com.uznai.security.UserPrincipal;
import com.uznai.service.impl.QuestionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionMapper questionMapper;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private User testUser;
    private UserPrincipal testUserPrincipal;
    private Quiz testQuiz;
    private Question testQuestion;
    private QuestionResponse testQuestionResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("testuser");
        testUserPrincipal = UserPrincipal.create(testUser);

        testQuiz = new Quiz();
        testQuiz.setId(UUID.randomUUID());
        testQuiz.setTitle("Test Quiz");
        testQuiz.setCreator(testUser);

        testQuestion = new Question();
        testQuestion.setId(UUID.randomUUID());
        testQuestion.setQuestionText("Test Question");
        testQuestion.setQuestionType(QuestionType.MULTIPLE_CHOICE_SINGLE);
        testQuestion.setOrderIndex(1);
        testQuestion.setQuiz(testQuiz);
        testQuestion.setVersion(1);

        testQuestionResponse = new QuestionResponse();
        testQuestionResponse.setId(testQuestion.getId());
        testQuestionResponse.setQuestionText(testQuestion.getQuestionText());
        testQuestionResponse.setQuestionType(testQuestion.getQuestionType());
        testQuestionResponse.setOrderIndex(testQuestion.getOrderIndex());
        testQuestionResponse.setVersion(testQuestion.getVersion());
    }

    @Test
    void createQuestion_ShouldCreateNewQuestion() {
        // Arrange
        CreateQuestionRequest request = new CreateQuestionRequest();
        request.setQuestionText("New Question");
        request.setQuestionType(QuestionType.MULTIPLE_CHOICE_SINGLE);
        request.setOrderIndex(1);

        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));
        when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);
        when(questionMapper.toResponse(any(Question.class))).thenReturn(testQuestionResponse);

        // Act
        QuestionResponse result = questionService.createQuestion(testQuiz.getId(), request, testUserPrincipal);

        // Assert
        assertNotNull(result);
        assertEquals(testQuestionResponse.getId(), result.getId());
        verify(questionRepository).save(any(Question.class));
    }

    @Test
    void createQuestion_ShouldThrowNotFoundException_WhenQuizNotFound() {
        // Arrange
        CreateQuestionRequest request = new CreateQuestionRequest();
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            questionService.createQuestion(testQuiz.getId(), request, testUserPrincipal);
        });
    }

    @Test
    void createQuestion_ShouldThrowUnauthorizedException_WhenUserNotCreator() {
        CreateQuestionRequest request = new CreateQuestionRequest();
        request.setQuestionText("New Question");
        request.setQuestionType(QuestionType.MULTIPLE_CHOICE_SINGLE);
        request.setOrderIndex(1);

        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        testQuiz.setCreator(differentUser);

        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));

        assertThrows(UnauthorizedException.class, () -> {
            questionService.createQuestion(testQuiz.getId(), request, testUserPrincipal);
        });

        verify(quizRepository).findById(testQuiz.getId());
        verifyNoMoreInteractions(questionRepository, questionMapper);
    }

    @Test
    void updateQuestion_ShouldUpdateExistingQuestion() {
        // Arrange
        UpdateQuestionRequest request = new UpdateQuestionRequest();
        request.setQuestionText("Updated Question");
        request.setQuestionType(QuestionType.MULTIPLE_CHOICE_MULTIPLE);
        request.setOrderIndex(2);
        request.setVersion(1);

        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuestion));
        when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);
        when(questionMapper.toResponse(any(Question.class))).thenReturn(testQuestionResponse);

        // Act
        QuestionResponse result = questionService.updateQuestion(testQuestion.getId(), request, testUserPrincipal);

        // Assert
        assertNotNull(result);
        assertEquals(testQuestionResponse.getId(), result.getId());
        verify(questionRepository).save(any(Question.class));
    }

    @Test
    void updateQuestion_ShouldThrowNotFoundException_WhenQuestionNotFound() {
        // Arrange
        UpdateQuestionRequest request = new UpdateQuestionRequest();
        request.setVersion(1);
        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            questionService.updateQuestion(testQuestion.getId(), request, testUserPrincipal);
        });
    }

    @Test
    void updateQuestion_ShouldThrowUnauthorizedException_WhenUserNotCreator() {
        UpdateQuestionRequest request = new UpdateQuestionRequest();
        request.setQuestionText("Updated Question");
        request.setQuestionType(QuestionType.MULTIPLE_CHOICE_SINGLE);
        request.setOrderIndex(1);
        request.setVersion(1);

        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        testQuiz.setCreator(differentUser);

        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuestion));

        assertThrows(UnauthorizedException.class, () -> {
            questionService.updateQuestion(testQuestion.getId(), request, testUserPrincipal);
        });

        verify(questionRepository).findById(testQuestion.getId());
        verifyNoMoreInteractions(questionRepository, questionMapper);
    }

    @Test
    void updateQuestion_ShouldThrowUnauthorizedException_WhenVersionMismatch() {
        // Arrange
        UpdateQuestionRequest request = new UpdateQuestionRequest();
        request.setVersion(2); // Different from testQuestion's version (1)
        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuestion));

        // Act & Assert
        assertThrows(UnauthorizedException.class, () -> {
            questionService.updateQuestion(testQuestion.getId(), request, testUserPrincipal);
        });
    }

    @Test
    void deleteQuestion_ShouldDeleteQuestion() {
        // Arrange
        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuestion));
        doNothing().when(questionRepository).delete(any(Question.class));

        // Act
        questionService.deleteQuestion(testQuestion.getId(), testUserPrincipal);

        // Assert
        verify(questionRepository).delete(any(Question.class));
    }

    @Test
    void deleteQuestion_ShouldThrowNotFoundException_WhenQuestionNotFound() {
        // Arrange
        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            questionService.deleteQuestion(testQuestion.getId(), testUserPrincipal);
        });
    }

    @Test
    void deleteQuestion_ShouldThrowUnauthorizedException_WhenUserNotCreator() {
        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        testQuiz.setCreator(differentUser);

        when(questionRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuestion));

        assertThrows(UnauthorizedException.class, () -> {
            questionService.deleteQuestion(testQuestion.getId(), testUserPrincipal);
        });

        verify(questionRepository).findById(testQuestion.getId());
        verifyNoMoreInteractions(questionRepository);
    }
} 