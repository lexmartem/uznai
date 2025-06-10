package com.uznai.mapper;

import com.uznai.dto.response.AnswerResultResponse;
import com.uznai.dto.response.QuestionResultResponse;
import com.uznai.entity.Answer;
import com.uznai.entity.QuestionResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {AnswerResultMapper.class})
public interface QuestionResultMapper {
    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "questionText", source = "question.questionText")
    @Mapping(target = "questionType", source = "question.questionType")
    @Mapping(target = "isCorrect", source = "isCorrect")
    @Mapping(target = "userAnswers", source = "selectedAnswerIds")
    @Mapping(target = "correctAnswers", source = "question.answers")
    QuestionResultResponse toResponse(QuestionResult result);

    default List<AnswerResultResponse> map(UUID[] selectedAnswerIds) {
        if (selectedAnswerIds == null) {
            return null;
        }
        return Arrays.stream(selectedAnswerIds)
                .map(id -> {
                    AnswerResultResponse response = new AnswerResultResponse();
                    response.setId(id);
                    return response;
                })
                .collect(Collectors.toList());
    }
} 