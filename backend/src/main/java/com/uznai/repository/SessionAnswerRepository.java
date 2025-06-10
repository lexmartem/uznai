package com.uznai.repository;

import com.uznai.entity.QuizSession;
import com.uznai.entity.SessionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionAnswerRepository extends JpaRepository<SessionAnswer, UUID> {
    @Query("SELECT sa FROM SessionAnswer sa WHERE sa.session = :session ORDER BY sa.question.orderIndex")
    List<SessionAnswer> findBySessionOrderByQuestionOrderIndex(@Param("session") QuizSession session);
    
    @Query("SELECT sa FROM SessionAnswer sa WHERE sa.session = :session AND sa.question.id = :questionId")
    Optional<SessionAnswer> findBySessionAndQuestionId(
            @Param("session") QuizSession session,
            @Param("questionId") UUID questionId);
    
    @Query("SELECT COUNT(sa) FROM SessionAnswer sa WHERE sa.session = :session")
    long countBySession(@Param("session") QuizSession session);
} 