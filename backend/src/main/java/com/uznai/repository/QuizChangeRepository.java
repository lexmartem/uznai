package com.uznai.repository;

import com.uznai.entity.Quiz;
import com.uznai.entity.QuizChange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuizChangeRepository extends JpaRepository<QuizChange, UUID> {
    Page<QuizChange> findByQuizOrderByCreatedAtDesc(Quiz quiz, Pageable pageable);
    
    @Query("SELECT c FROM QuizChange c WHERE c.quiz = :quiz AND c.createdAt > :since ORDER BY c.createdAt DESC")
    Page<QuizChange> findChangesSince(@Param("quiz") Quiz quiz, @Param("since") java.time.LocalDateTime since, Pageable pageable);
} 