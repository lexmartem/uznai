package com.uznai.controller;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.entity.User;
import com.uznai.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getQuestionsByQuizId(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(questionService.getQuestionsByQuizId(quizId, user));
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @PathVariable UUID quizId,
            @Valid @RequestBody CreateQuestionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(questionService.createQuestion(quizId, request, user));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @AuthenticationPrincipal User user) {
        questionService.deleteQuestion(questionId, user);
        return ResponseEntity.noContent().build();
    }
} 