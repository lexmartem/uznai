package com.uznai.controller;

import com.uznai.dto.request.QuizChangeRequest;
import com.uznai.service.QuizCollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class QuizWebSocketController {

    private final QuizCollaborationService quizCollaborationService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/quiz/{quizId}/join")
    public void handleUserJoin(@DestinationVariable String quizId, 
                             SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        quizCollaborationService.userJoined(quizId, username);
        
        // Notify all users in the quiz room
        messagingTemplate.convertAndSend(
            "/topic/quiz/" + quizId + "/users",
            quizCollaborationService.getActiveUsers(quizId)
        );
    }

    @MessageMapping("/quiz/{quizId}/leave")
    public void handleUserLeave(@DestinationVariable String quizId,
                              SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        quizCollaborationService.userLeft(quizId, username);
        
        // Notify all users in the quiz room
        messagingTemplate.convertAndSend(
            "/topic/quiz/" + quizId + "/users",
            quizCollaborationService.getActiveUsers(quizId)
        );
    }

    @MessageMapping("/quiz/{quizId}/changes")
    public void handleQuizChange(@DestinationVariable String quizId,
                               @Payload QuizChangeRequest changeRequest,
                               SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        
        // Process the change and get the updated quiz
        var updatedQuiz = quizCollaborationService.processChange(quizId, username, changeRequest);
        
        // Broadcast the change to all users in the quiz room
        messagingTemplate.convertAndSend(
            "/topic/quiz/" + quizId + "/changes",
            updatedQuiz
        );
    }
} 