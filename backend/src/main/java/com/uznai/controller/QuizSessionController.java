package com.uznai.controller;

import com.uznai.dto.request.StartQuizSessionRequest;
import com.uznai.dto.request.SubmitAnswerRequest;
import com.uznai.dto.response.QuizQuestionResponse;
import com.uznai.dto.response.QuizSessionResponse;
import com.uznai.security.UserPrincipal;
import com.uznai.service.QuizSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Quiz Session", description = "APIs for managing quiz sessions")
@SecurityRequirement(name = "bearerAuth")
public class QuizSessionController {

    private final QuizSessionService quizSessionService;

    @PostMapping("/quizzes/{quizId}/sessions")
    @Operation(summary = "Start a new quiz session", description = "Creates a new session for taking a quiz")
    public ResponseEntity<QuizSessionResponse> startSession(
            @PathVariable UUID quizId,
            @Valid @RequestBody StartQuizSessionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ResponseEntity<>(quizSessionService.startSession(request, userPrincipal), HttpStatus.CREATED);
    }

    @GetMapping("/sessions/{sessionId}")
    @Operation(summary = "Get quiz session details", description = "Retrieves information about a specific quiz session")
    public ResponseEntity<QuizSessionResponse> getSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizSessionService.getSession(sessionId, userPrincipal));
    }

    @GetMapping("/sessions/{sessionId}/questions")
    @Operation(summary = "Get quiz session questions", description = "Retrieves questions for a quiz session with pagination")
    public ResponseEntity<Page<QuizQuestionResponse>> getSessionQuestions(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(quizSessionService.getSessionQuestions(sessionId, userPrincipal, pageable));
    }

    @PostMapping("/sessions/{sessionId}/questions/{questionId}/answers")
    @Operation(summary = "Submit an answer", description = "Submits an answer for a specific question in a quiz session")
    public ResponseEntity<Void> submitAnswer(
            @PathVariable UUID sessionId,
            @PathVariable UUID questionId,
            @Valid @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        quizSessionService.submitAnswer(sessionId, questionId, request, userPrincipal);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sessions/{sessionId}/complete")
    @Operation(summary = "Complete a quiz session", description = "Marks a quiz session as completed and generates results")
    public ResponseEntity<QuizSessionResponse> completeSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizSessionService.completeSession(sessionId, userPrincipal));
    }

    @PostMapping("/sessions/{sessionId}/expire")
    @Operation(summary = "Expire a quiz session", description = "Marks a quiz session as expired")
    public ResponseEntity<Void> expireSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        quizSessionService.expireSession(sessionId, userPrincipal);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/me/sessions")
    @Operation(summary = "Get user's active sessions", description = "Retrieves all active quiz sessions for the current user")
    public ResponseEntity<Page<QuizSessionResponse>> getUserSessions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(quizSessionService.getUserSessions(userPrincipal, pageable));
    }
} 