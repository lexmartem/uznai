package com.uznai.repository;

import com.uznai.entity.QuestionResult;
import com.uznai.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionResultRepository extends JpaRepository<QuestionResult, UUID> {
    List<QuestionResult> findByResultOrderByQuestionOrderIndex(QuizResult result);
    
    @Query("SELECT COUNT(qr) FROM QuestionResult qr WHERE qr.result = :result AND qr.isCorrect = true")
    long countCorrectAnswers(@Param("result") QuizResult result);
    
    @Query("SELECT qr FROM QuestionResult qr WHERE qr.result = :result AND qr.question.id = :questionId")
    QuestionResult findByResultAndQuestionId(
            @Param("result") QuizResult result,
            @Param("questionId") UUID questionId);
} 