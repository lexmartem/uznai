package com.uznai.service;

import com.uznai.dto.request.CreateQuizRequest;
import com.uznai.dto.request.UpdateQuizRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.entity.Quiz;
import com.uznai.entity.User;
import com.uznai.exception.NotFoundException;
import com.uznai.exception.UnauthorizedException;
import com.uznai.mapper.QuizMapper;
import com.uznai.repository.QuizRepository;
import com.uznai.repository.UserRepository;
import com.uznai.service.impl.QuizServiceImpl;
import com.uznai.security.UserPrincipal;
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
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuizMapper quizMapper;

    @InjectMocks
    private QuizServiceImpl quizService;

    private User testUser;
    private UserPrincipal testUserPrincipal;
    private Quiz testQuiz;
    private QuizResponse testQuizResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("testuser");

        testUserPrincipal = UserPrincipal.create(testUser);

        testQuiz = new Quiz();
        testQuiz.setId(UUID.randomUUID());
        testQuiz.setTitle("Test Quiz");
        testQuiz.setDescription("Test Description");
        testQuiz.setCreator(testUser);
        testQuiz.setPublic(true);
        testQuiz.setVersion(1L);

        testQuizResponse = new QuizResponse();
        testQuizResponse.setId(testQuiz.getId());
        testQuizResponse.setTitle(testQuiz.getTitle());
        testQuizResponse.setDescription(testQuiz.getDescription());
        testQuizResponse.setIsPublic(testQuiz.isPublic());
        testQuizResponse.setVersion(testQuiz.getVersion());
    }

    @Test
    void createQuiz_ShouldCreateNewQuiz() {
        CreateQuizRequest request = new CreateQuizRequest();
        request.setTitle("New Quiz");
        request.setDescription("New Description");
        request.setIsPublic(true);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(quizRepository.existsByTitleAndCreator(request.getTitle(), testUser)).thenReturn(false);
        when(quizMapper.toEntity(request)).thenReturn(testQuiz);
        when(quizRepository.save(testQuiz)).thenReturn(testQuiz);
        when(quizMapper.toResponse(testQuiz)).thenReturn(testQuizResponse);

        QuizResponse result = quizService.createQuiz(request, testUserPrincipal);

        assertNotNull(result);
        assertEquals(testQuizResponse, result);

        verify(userRepository).findById(testUser.getId());
        verify(quizRepository).existsByTitleAndCreator(request.getTitle(), testUser);
        verify(quizMapper).toEntity(request);
        verify(quizRepository).save(testQuiz);
        verify(quizMapper).toResponse(testQuiz);
    }

    @Test
    void createQuiz_ShouldThrowNotFoundException_WhenUserNotFound() {
        CreateQuizRequest request = new CreateQuizRequest();
        request.setTitle("New Quiz");
        request.setDescription("New Description");
        request.setIsPublic(true);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            quizService.createQuiz(request, testUserPrincipal);
        });

        verify(userRepository).findById(testUser.getId());
        verifyNoMoreInteractions(quizRepository, quizMapper);
    }

    @Test
    void updateQuiz_ShouldUpdateExistingQuiz() {
        UpdateQuizRequest request = new UpdateQuizRequest();
        request.setTitle("Updated Quiz");
        request.setDescription("Updated Description");
        request.setIsPublic(false);
        request.setVersion(1L);

        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));
        when(quizRepository.save(any(Quiz.class))).thenReturn(testQuiz);
        when(quizMapper.toResponse(any(Quiz.class))).thenReturn(testQuizResponse);

        QuizResponse result = quizService.updateQuiz(testQuiz.getId(), request, testUserPrincipal);

        assertNotNull(result);
        assertEquals(testQuizResponse.getId(), result.getId());
        verify(quizRepository).save(any(Quiz.class));
    }

    @Test
    void updateQuiz_ShouldThrowNotFoundException_WhenQuizNotFound() {
        UpdateQuizRequest request = new UpdateQuizRequest();
        request.setVersion(1L);
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            quizService.updateQuiz(testQuiz.getId(), request, testUserPrincipal);
        });
    }

    @Test
    void updateQuiz_ShouldThrowUnauthorizedException_WhenUserNotCreator() {
        UpdateQuizRequest request = new UpdateQuizRequest();
        request.setVersion(1L);
        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        UserPrincipal differentUserPrincipal = UserPrincipal.create(differentUser);
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));

        assertThrows(UnauthorizedException.class, () -> {
            quizService.updateQuiz(testQuiz.getId(), request, differentUserPrincipal);
        });
    }

    @Test
    void updateQuiz_ShouldThrowUnauthorizedException_WhenVersionMismatch() {
        UpdateQuizRequest request = new UpdateQuizRequest();
        request.setVersion(2L);
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));

        assertThrows(IllegalArgumentException.class, () -> {
            quizService.updateQuiz(testQuiz.getId(), request, testUserPrincipal);
        });
    }

    @Test
    void deleteQuiz_ShouldDeleteQuiz() {
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));
        doNothing().when(quizRepository).delete(any(Quiz.class));

        quizService.deleteQuiz(testQuiz.getId(), testUserPrincipal);

        verify(quizRepository).delete(any(Quiz.class));
    }

    @Test
    void deleteQuiz_ShouldThrowNotFoundException_WhenQuizNotFound() {
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            quizService.deleteQuiz(testQuiz.getId(), testUserPrincipal);
        });
    }

    @Test
    void deleteQuiz_ShouldThrowUnauthorizedException_WhenUserNotCreator() {
        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        UserPrincipal differentUserPrincipal = UserPrincipal.create(differentUser);
        when(quizRepository.findById(any(UUID.class))).thenReturn(Optional.of(testQuiz));

        assertThrows(UnauthorizedException.class, () -> {
            quizService.deleteQuiz(testQuiz.getId(), differentUserPrincipal);
        });
    }
} 