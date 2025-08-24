> 2025.08.24

useQuestionsContext -> useAvailableQuestions
QuestionsBreadcrumbs -> QuestionsScopeBreadcrumbs

paths:

const { manageScope } = useManageTopicsStore();

const topicsListRoutePath = `/topics/${manageScope}`;
const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
const questionsListRoutePath = `${topicRoutePath}/questions`;
const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
const answersListRoutePath = `${questionRoutePath}/answers`;
const answerRoutePath = `${answersListRoutePath}/${answerId}`;
