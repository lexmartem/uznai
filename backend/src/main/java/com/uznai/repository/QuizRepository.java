package com.uznai.repository;

import com.uznai.entity.Quiz;
import com.uznai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    Page<Quiz> findByCreator(User creator, Pageable pageable);
    
    Page<Quiz> findByCreatorAndIsPublic(User creator, boolean isPublic, Pageable pageable);
    
    Page<Quiz> findByIsPublic(boolean isPublic, Pageable pageable);
    
    @Query("SELECT q FROM Quiz q WHERE q.creator = :creator OR q.isPublic = true")
    Page<Quiz> findAccessibleQuizzes(@Param("creator") User creator, Pageable pageable);
    
    @Query("SELECT q FROM Quiz q WHERE q.creator = :user OR q.isPublic = true")
    Page<Quiz> findUserQuizzes(@Param("user") User user, Pageable pageable);
    
    boolean existsByTitleAndCreator(String title, User creator);

    Page<Quiz> findByCreatorIdAndIsPublic(UUID creatorId, boolean isPublic, Pageable pageable);
} 