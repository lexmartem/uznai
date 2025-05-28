package com.uznai.exception;

public class QuizNotFoundException extends RuntimeException {
    public QuizNotFoundException(String quizId) {
        super("Quiz not found with id: " + quizId);
    }
} 