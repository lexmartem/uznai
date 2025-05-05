package com.uznai.controller;

import com.uznai.dto.request.CreateQuizRequest;
import com.uznai.dto.request.UpdateQuizRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.dto.response.QuizSummaryResponse;
import com.uznai.entity.User;
import com.uznai.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<Page<QuizSummaryResponse>> getUserQuizzes(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getUserQuizzes(user, pageable));
    }

    @GetMapping("/created")
    public ResponseEntity<Page<QuizSummaryResponse>> getCreatedQuizzes(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getCreatedQuizzes(user, pageable));
    }

    @GetMapping("/collaborated")
    public ResponseEntity<Page<QuizSummaryResponse>> getCollaboratedQuizzes(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getCollaboratedQuizzes(user, pageable));
    }

    @GetMapping("/public")
    public ResponseEntity<Page<QuizSummaryResponse>> getPublicQuizzes(Pageable pageable) {
        return ResponseEntity.ok(quizService.getPublicQuizzes(pageable));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizResponse> getQuizById(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(quizService.getQuizById(quizId, user));
    }

    @PostMapping
    public ResponseEntity<QuizResponse> createQuiz(
            @Valid @RequestBody CreateQuizRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(quizService.createQuiz(request, user));
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable UUID quizId,
            @Valid @RequestBody UpdateQuizRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(quizService.updateQuiz(quizId, request, user));
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal User user) {
        quizService.deleteQuiz(quizId, user);
        return ResponseEntity.noContent().build();
    }
} 