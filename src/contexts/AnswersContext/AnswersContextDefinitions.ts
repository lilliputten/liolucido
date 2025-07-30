import { TRoutePath } from '@/config/routesConfig';
import { TAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';

export interface AnswersContextData {
  answers: TAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<TAnswer[]>>;
  routePath: TRoutePath;
  questionsListRoutePath: TRoutePath;
  questionRootRoutePath: TRoutePath;
  questionId: TQuestionId;
  topicsListRoutePath: TRoutePath;
  topicRootRoutePath: TRoutePath;
  topicId: TTopicId;
}
