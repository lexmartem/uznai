package com.uznai.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quiz_collaborators")
@Getter
@Setter
public class QuizCollaborator {
    @EmbeddedId
    private QuizCollaboratorId id = new QuizCollaboratorId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("quizId")
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

@Embeddable
@Getter
@Setter
class QuizCollaboratorId implements java.io.Serializable {
    @Column(name = "quiz_id")
    private UUID quizId;

    @Column(name = "user_id")
    private UUID userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuizCollaboratorId that = (QuizCollaboratorId) o;
        return quizId.equals(that.quizId) && userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(quizId, userId);
    }
} 