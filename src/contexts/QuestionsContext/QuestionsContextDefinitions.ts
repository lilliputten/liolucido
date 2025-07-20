import { TRoutePath } from '@/config/routesConfig';
import { TQuestion } from '@/features/questions/types';

export interface QuestionsContextData {
  questions: TQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  routePath: TRoutePath;
}
