package com.uznai.controller;

import com.uznai.dto.request.CreateQuestionRequest;
import com.uznai.dto.request.UpdateQuestionRequest;
import com.uznai.dto.response.QuestionResponse;
import com.uznai.dto.request.CreateAnswerRequest;
import com.uznai.dto.request.UpdateAnswerRequest;
import com.uznai.dto.response.AnswerResponse;
import com.uznai.entity.User;
import com.uznai.service.QuestionService;
import com.uznai.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/quizzes/{quizId}/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getQuestionsByQuizId(
            @PathVariable UUID quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(questionService.getQuestionsByQuizId(quizId, userPrincipal));
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @PathVariable UUID quizId,
            @Valid @RequestBody CreateQuestionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(questionService.createQuestion(quizId, request, userPrincipal));
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @Valid @RequestBody UpdateQuestionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(questionService.updateQuestion(questionId, request, userPrincipal));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        questionService.deleteQuestion(questionId, userPrincipal);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<AnswerResponse> createAnswer(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @Valid @RequestBody CreateAnswerRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        AnswerResponse answer = questionService.createAnswer(quizId, questionId, request, userPrincipal);
        return ResponseEntity.ok(answer);
    }

    @PutMapping("/{questionId}/answers/{answerId}")
    public ResponseEntity<AnswerResponse> updateAnswer(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @PathVariable UUID answerId,
            @Valid @RequestBody UpdateAnswerRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        AnswerResponse answer = questionService.updateAnswer(answerId, request, userPrincipal);
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/{questionId}/answers")
    public ResponseEntity<List<AnswerResponse>> getAnswersByQuestionId(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(questionService.getAnswersByQuestionId(questionId, userPrincipal));
    }

    @DeleteMapping("/{questionId}/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @PathVariable UUID answerId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        questionService.deleteAnswer(answerId, userPrincipal);
        return ResponseEntity.noContent().build();
    }
} 