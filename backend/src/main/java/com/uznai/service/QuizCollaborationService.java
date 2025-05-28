package com.uznai.service;

import com.uznai.dto.request.QuizChangeRequest;
import com.uznai.dto.response.QuizResponse;
import java.util.List;

public interface QuizCollaborationService {
    void userJoined(String quizId, String username);
    void userLeft(String quizId, String username);
    List<String> getActiveUsers(String quizId);
    QuizResponse processChange(String quizId, String username, QuizChangeRequest changeRequest);
} 