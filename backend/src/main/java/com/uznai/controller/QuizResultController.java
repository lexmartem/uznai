package com.uznai.controller;

import com.uznai.dto.response.QuizResultResponse;
import com.uznai.security.UserPrincipal;
import com.uznai.service.QuizResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Quiz Results", description = "APIs for managing quiz results")
@SecurityRequirement(name = "bearerAuth")
public class QuizResultController {

    private final QuizResultService quizResultService;

    @GetMapping("/results/{resultId}")
    @Operation(summary = "Get quiz result", description = "Retrieves detailed information about a specific quiz result")
    public ResponseEntity<QuizResultResponse> getResult(
            @PathVariable UUID resultId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizResultService.getResult(resultId, userPrincipal));
    }

    @GetMapping("/users/me/results")
    @Operation(summary = "Get user's quiz results", description = "Retrieves all quiz results for the current user")
    public ResponseEntity<Page<QuizResultResponse>> getUserResults(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(quizResultService.getUserResults(userPrincipal, pageable));
    }

    @GetMapping("/users/me/results/quiz/{quizId}")
    @Operation(summary = "Get user's results for a specific quiz", description = "Retrieves all results for a specific quiz for the current user")
    public ResponseEntity<Page<QuizResultResponse>> getUserResultsForQuiz(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(quizResultService.getUserResultsForQuiz(quizId, userPrincipal, pageable));
    }

    @GetMapping("/users/me/results/quiz/{quizId}/latest")
    @Operation(summary = "Get user's latest result for a quiz", description = "Retrieves the most recent result for a specific quiz for the current user")
    public ResponseEntity<QuizResultResponse> getLatestResultForQuiz(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizResultService.getLatestResultForQuiz(quizId, userPrincipal));
    }
} 