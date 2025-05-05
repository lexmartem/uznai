package com.uznai.repository;

import com.uznai.entity.Question;
import com.uznai.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByQuizOrderByOrderIndex(Quiz quiz);
    
    @Query("SELECT MAX(q.orderIndex) FROM Question q WHERE q.quiz = :quiz")
    Integer findMaxOrderIndexByQuiz(@Param("quiz") Quiz quiz);
    
    @Query("SELECT q FROM Question q WHERE q.quiz = :quiz AND q.orderIndex > :orderIndex ORDER BY q.orderIndex")
    List<Question> findQuestionsAfterOrderIndex(@Param("quiz") Quiz quiz, @Param("orderIndex") Integer orderIndex);
    
    @Query("SELECT q FROM Question q WHERE q.quiz = :quiz AND q.orderIndex >= :startIndex AND q.orderIndex <= :endIndex ORDER BY q.orderIndex")
    List<Question> findQuestionsInRange(@Param("quiz") Quiz quiz, @Param("startIndex") Integer startIndex, @Param("endIndex") Integer endIndex);
} 