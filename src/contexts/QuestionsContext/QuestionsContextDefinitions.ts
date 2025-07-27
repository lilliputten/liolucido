import { TRoutePath } from '@/config/routesConfig';
import { TQuestion } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';

export interface QuestionsContextData {
  questions: TQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  routePath: TRoutePath;
  topicRootRoutePath: TRoutePath;
  topicsListRoutePath: TRoutePath;
  topicId: TTopicId;
  topicName: string;
}
