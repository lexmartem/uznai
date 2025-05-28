package com.uznai.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uznai.dto.request.QuizChangeRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.entity.Quiz;
import com.uznai.entity.QuizChange;
import com.uznai.entity.User;
import com.uznai.exception.QuizNotFoundException;
import com.uznai.exception.UserNotFoundException;
import com.uznai.mapper.QuizMapper;
import com.uznai.repository.QuizRepository;
import com.uznai.repository.UserRepository;
import com.uznai.service.QuizCollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizCollaborationServiceImpl implements QuizCollaborationService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizMapper quizMapper;
    private final ObjectMapper objectMapper;

    // In-memory storage for active users in each quiz
    private final Map<String, List<String>> activeUsers = new ConcurrentHashMap<>();

    @Override
    public void userJoined(String quizId, String username) {
        activeUsers.computeIfAbsent(quizId, k -> new java.util.ArrayList<>())
                  .add(username);
    }

    @Override
    public void userLeft(String quizId, String username) {
        activeUsers.computeIfPresent(quizId, (k, v) -> {
            v.remove(username);
            return v.isEmpty() ? null : v;
        });
    }

    @Override
    public List<String> getActiveUsers(String quizId) {
        return activeUsers.getOrDefault(quizId, List.of());
    }

    @Override
    @Transactional
    public QuizResponse processChange(String quizId, String username, QuizChangeRequest changeRequest) {
        Quiz quiz = quizRepository.findById(UUID.fromString(quizId))
                .orElseThrow(() -> new QuizNotFoundException(quizId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        // Check version to prevent conflicts
        if (!quiz.getVersion().equals(changeRequest.getVersion())) {
            throw new RuntimeException("Version conflict detected");
        }

        // Create and save the change
        QuizChange change = new QuizChange();
        change.setQuiz(quiz);
        change.setUser(user);
        change.setChangeType(changeRequest.getChangeType());
        change.setChangeData(changeRequest.getChangeData());

        // Apply the change based on type
        switch (changeRequest.getChangeType()) {
            case QUIZ_UPDATED -> updateQuiz(quiz, changeRequest);
            case QUESTION_ADDED -> addQuestion(quiz, changeRequest);
            case QUESTION_UPDATED -> updateQuestion(quiz, changeRequest);
            case QUESTION_DELETED -> deleteQuestion(quiz, changeRequest);
            // Add other cases as needed
        }

        // Save the updated quiz
        Quiz updatedQuiz = quizRepository.save(quiz);

        // Return the updated quiz response
        return quizMapper.toResponse(updatedQuiz);
    }

    private void updateQuiz(Quiz quiz, QuizChangeRequest changeRequest) {
        try {
            var updates = objectMapper.readValue(changeRequest.getChangeData(), Map.class);
            if (updates.containsKey("title")) {
                quiz.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("description")) {
                quiz.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("isPublic")) {
                quiz.setPublic((Boolean) updates.get("isPublic"));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process quiz update", e);
        }
    }

    private void addQuestion(Quiz quiz, QuizChangeRequest changeRequest) {
        // Implementation for adding a question
    }

    private void updateQuestion(Quiz quiz, QuizChangeRequest changeRequest) {
        // Implementation for updating a question
    }

    private void deleteQuestion(Quiz quiz, QuizChangeRequest changeRequest) {
        // Implementation for deleting a question
    }
} 