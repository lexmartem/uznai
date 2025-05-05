package com.uznai.repository;

import com.uznai.entity.Answer;
import com.uznai.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, UUID> {
    List<Answer> findByQuestionOrderByOrderIndex(Question question);
    
    @Query("SELECT MAX(a.orderIndex) FROM Answer a WHERE a.question = :question")
    Integer findMaxOrderIndexByQuestion(@Param("question") Question question);
    
    @Query("SELECT a FROM Answer a WHERE a.question = :question AND a.orderIndex > :orderIndex ORDER BY a.orderIndex")
    List<Answer> findAnswersAfterOrderIndex(@Param("question") Question question, @Param("orderIndex") Integer orderIndex);
    
    @Query("SELECT a FROM Answer a WHERE a.question = :question AND a.orderIndex >= :startIndex AND a.orderIndex <= :endIndex ORDER BY a.orderIndex")
    List<Answer> findAnswersInRange(@Param("question") Question question, @Param("startIndex") Integer startIndex, @Param("endIndex") Integer endIndex);
    
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.question = :question AND a.isCorrect = true")
    int countCorrectAnswers(@Param("question") Question question);
} 