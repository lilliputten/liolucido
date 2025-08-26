> 2025.08.24

```javascript

useAnswersContext -> useAvailableAnswers, useAvailableAnswerById
AnswersBreadcrumbs -> AnswersScopeBreadcrumbs

useQuestionsContext -> useAvailableQuestions, useAvailableQuestionById
QuestionsBreadcrumbs -> QuestionsScopeBreadcrumbs

useTopicsContext -> useAvailableTopicsByScope (-> useAvailableTopics), useAvailableTopicById
TopicsBreadcrumbs -> TopicsScopeBreadcrumbs

// Paths

const { manageScope } = useManageTopicsStore();

// Calculate paths...
const topicsListRoutePath = `/topics/${manageScope}`;
const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
const questionsListRoutePath = `${topicRoutePath}/questions`;
const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
const answersListRoutePath = `${questionRoutePath}/answers`;
const answerRoutePath = `${answersListRoutePath}/${answerId}`;

questionsContext.routePath -> questionsListRoutePath

```
