package com.uznai.controller;

import com.uznai.dto.request.CreateQuizRequest;
import com.uznai.dto.request.UpdateQuizRequest;
import com.uznai.dto.response.QuizResponse;
import com.uznai.dto.response.QuizSummaryResponse;
import com.uznai.entity.User;
import com.uznai.service.QuizService;
import com.uznai.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @GetMapping("/me")
    public ResponseEntity<Page<QuizSummaryResponse>> getUserQuizzes(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getUserQuizzes(userPrincipal, pageable));
    }

    @GetMapping("/created")
    public ResponseEntity<Page<QuizSummaryResponse>> getCreatedQuizzes(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getCreatedQuizzes(userPrincipal, pageable));
    }

    @GetMapping("/collaborated")
    public ResponseEntity<Page<QuizSummaryResponse>> getCollaboratedQuizzes(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getCollaboratedQuizzes(userPrincipal, pageable));
    }

    @GetMapping("/public")
    public ResponseEntity<Page<QuizSummaryResponse>> getPublicQuizzes(Pageable pageable) {
        return ResponseEntity.ok(quizService.getPublicQuizzes(pageable));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizResponse> getQuizById(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizService.getQuizById(quizId, userPrincipal));
    }

    @PostMapping
    public ResponseEntity<QuizResponse> createQuiz(
            @Valid @RequestBody CreateQuizRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UUID userId = userPrincipal.getId();
        return ResponseEntity.ok(quizService.createQuiz(request, userPrincipal));
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable UUID quizId,
            @Valid @RequestBody UpdateQuizRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizService.updateQuiz(quizId, request, userPrincipal));
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        quizService.deleteQuiz(quizId, userPrincipal);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}/quizzes")
    public ResponseEntity<Page<QuizSummaryResponse>> getPublicQuizzesByUser(
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(quizService.getPublicQuizzesByUser(userId, pageable));
    }
} 