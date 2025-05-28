package com.uznai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "quiz_changes")
public class QuizChange {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "change_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ChangeType changeType;

    @Column(name = "change_data", columnDefinition = "jsonb")
    private String changeData;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ChangeType {
        QUIZ_CREATED,
        QUIZ_UPDATED,
        QUESTION_ADDED,
        QUESTION_UPDATED,
        QUESTION_DELETED,
        ANSWER_ADDED,
        ANSWER_UPDATED,
        ANSWER_DELETED,
        COLLABORATOR_ADDED,
        COLLABORATOR_REMOVED
    }
} 