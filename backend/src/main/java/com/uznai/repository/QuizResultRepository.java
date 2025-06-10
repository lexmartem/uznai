package com.uznai.repository;

import com.uznai.entity.Quiz;
import com.uznai.entity.QuizResult;
import com.uznai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, UUID> {
    Page<QuizResult> findByUserOrderByCompletedAtDesc(User user, Pageable pageable);
    Page<QuizResult> findByUserAndQuizOrderByCompletedAtDesc(User user, Quiz quiz, Pageable pageable);
    Optional<QuizResult> findFirstByUserAndQuizOrderByCompletedAtDesc(User user, Quiz quiz);
    
    @Query("SELECT r FROM QuizResult r WHERE r.session.id = :sessionId")
    Optional<QuizResult> findBySessionId(@Param("sessionId") UUID sessionId);
    
    @Query("SELECT r FROM QuizResult r WHERE r.user = :user AND r.quiz = :quiz ORDER BY r.score DESC")
    Page<QuizResult> findTopResultsByUserAndQuiz(
            @Param("user") User user,
            @Param("quiz") Quiz quiz,
            Pageable pageable);
} 