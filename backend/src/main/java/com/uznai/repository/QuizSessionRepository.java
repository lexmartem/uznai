package com.uznai.repository;

import com.uznai.entity.QuizSession;
import com.uznai.entity.User;
import com.uznai.entity.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizSessionRepository extends JpaRepository<QuizSession, UUID> {
    List<QuizSession> findByUserAndStatus(User user, SessionStatus status);
    
    List<QuizSession> findByUserAndStatusAndExpiresAtBefore(User user, SessionStatus status, LocalDateTime time);
    
    @Query("SELECT s FROM QuizSession s WHERE s.user = :user AND s.status = :status AND s.quiz.id = :quizId")
    Optional<QuizSession> findActiveSessionForUserAndQuiz(
            @Param("user") User user,
            @Param("status") SessionStatus status,
            @Param("quizId") UUID quizId);
    
    @Query("SELECT s FROM QuizSession s WHERE s.status = :status AND s.expiresAt < :time")
    List<QuizSession> findExpiredSessions(
            @Param("status") SessionStatus status,
            @Param("time") LocalDateTime time);

    Page<QuizSession> findByUserAndStatus(User user, SessionStatus status, Pageable pageable);
} 