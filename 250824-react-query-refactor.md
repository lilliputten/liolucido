> 2025.08.24

useAnswersContext -> useAvailableAnswers
AnswersBreadcrumbs -> AnswersScopeBreadcrumbs

useQuestionsContext -> useAvailableQuestions
QuestionsBreadcrumbs -> QuestionsScopeBreadcrumbs

useTopicsContext -> useAvailableTopicsByScope (-> useAvailableTopics)
TopicsBreadcrumbs -> TopicsScopeBreadcrumbs

paths:

const { manageScope } = useManageTopicsStore();

const topicsListRoutePath = `/topics/${manageScope}`;
const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
const questionsListRoutePath = `${topicRoutePath}/questions`;
const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
const answersListRoutePath = `${questionRoutePath}/answers`;
const answerRoutePath = `${answersListRoutePath}/${answerId}`;

questionsContext.routePath -> questionsListRoutePath
