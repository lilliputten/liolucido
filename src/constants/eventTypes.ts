import { TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';

export const updatedTopicsCountEventName = 'updated-topics-count';
export type TUpdatedTopicsCountDetail = {
  topicsCount: number;
};

export const deletedTopicEventName = 'deleted-topic';
export type TDeletedTopicDetail = {
  deletedTopicId: TTopicId;
  topicsCount: number;
};

export const updatedQuestionsCountEventName = 'updated-questions-count';
export type TUpdatedQuestionsCountDetail = {
  topicId: TTopicId;
  questionsCount: number;
};

export const addedQuestionEventName = 'added-question';
export type TAddedQuestionDetail = {
  topicId: TTopicId;
  addedQuestionId: TQuestionId;
  questionsCount: number;
};

export const deletedQuestionEventName = 'deleted-question';
export type TDeletedQuestionDetail = {
  topicId: TTopicId;
  deletedQuestionId: TQuestionId;
  questionsCount: number;
};

export const updatedAnswersCountEventName = 'updated-answers-count';
export type TUpdatedAnswersCountDetail = {
  questionId: TQuestionId;
  answersCount: number;
};

export const addedAnswerEventName = 'added-answer';
export type TAddedAnswerDetail = {
  questionId: TQuestionId;
  addedAnswerId: TAnswerId;
  answersCount: number;
};

export const deletedAnswerEventName = 'deleted-answer';
export type TDeletedAnswerDetail = {
  questionId: TQuestionId;
  deletedAnswerId: TAnswerId;
  answersCount: number;
};
