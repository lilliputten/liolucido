Ok, Let's try to replace all direct calls to server functions and client fetch

Don't forget to add eslint comments and debugger stoppers for all console.error call occurencies:

```
// eslint-disable-next-line no-console
console.error(...)
debugger; // eslint-disable-line no-debugger
```

Use the `src/app/api/questions/[questionId]/answers/route.ts` and `src/components/pages/AvailableTopics/WorkoutQuestion/WorkoutQuestionContainer.tsx` as examples of server- and client-side implementations.

Here is a draf list of server side routes and functions, what require update:

- src/app/api/questions/[questionId]/answers/route.ts (already done)
- src/app/api/questions/[questionId]/route.ts
- src/app/api/settings/route.ts
- src/app/api/workouts/route.ts
- src/app/api/workouts/[topicId]/route.ts
- src/features/answers/actions/addNewAnswer.ts
- src/features/answers/actions/deleteAnswer.ts
- src/features/answers/actions/getQuestionAnswers.ts
- src/features/answers/actions/updateAnswer.ts
- src/features/questions/actions/addNewQuestion.ts
- src/features/questions/actions/deleteQuestion.ts
- src/features/questions/actions/getQuestion.ts
- src/features/questions/actions/getTopicQuestions.ts
- src/features/questions/actions/updateQuestion.ts
- src/features/settings/actions/getSettings.ts
- src/features/settings/actions/updateSettings.ts
- src/features/topics/actions/addNewTopic.ts
- src/features/topics/actions/checkIfTopicExists.ts
- src/features/topics/actions/deleteTopic.ts
- src/features/topics/actions/getAllUsersTopics.ts
- src/features/topics/actions/getAvailableTopics.ts
- src/features/topics/actions/getThisUserTopics.ts
- src/features/topics/actions/getTopic.ts
- src/features/topics/actions/updateTopic.ts
- src/features/users/actions/checkIfUserExists.ts
- src/features/users/actions/createUserOrUpdateTelegramUser.ts
- src/features/users/actions/deleteUser.ts
- src/features/users/actions/getUserByEmail.ts
- src/features/users/actions/getUserById.ts
- src/features/users/actions/getUsersByIdsList.ts

Can you find all the calls to these api methods on the client side on your own, or do you need help?

---

Corrections:

Some fixes for server parts:

- Use `src/app/api/questions/[questionId]/answers/route.ts` as a template for server side parts:

- Please don't use `duration` properties for messages: I've already got rid of it (it's not necessary).

- Just make short commented placeholders for `invalidateKeys` and `messages`.

All other things in server parts look ok (later we'll pass it through linters).

Client parts:

- Use answers retrieving fragment `src/components/pages/AvailableTopics/WorkoutQuestion/WorkoutQuestionContainer.tsx` as a template.

- Use `onInvalidateKeys: invalidateReactQueryKeys` instead inline functions for `onInvalidateKeys` options fields (I'll integrate it with react query later). There already is implementation of `invalidateReactQueryKeys` in the `src/lib/data/invalidateReactQueryKeys.ts` (available to import as `import { invalidateReactQueryKeys } from '@/lib/data';`).

- Add `debugDetails` option parameter to simplify the debugging process. It should be an object like `debugDetails: { initiator: 'WorkoutQuestionContainer', url },` -- it contains a reference on a distinctive initiator component/module/path and other available parameters (an `url` in this case).

- In the `catch` section fetch ad disaplay in `console.error` the `APIError` details property (`const details = error instanceof APIError ? error.details : null;`).

- Display a toast error message in case of error, if there no this call yet.

Generic recomendations:

- Don't add duplicated imports.

- Keep also in mind that you have to import types from '@shared', like `import { APIError } from '@/shared/types/api';`.

---

Check these modules for the usage of `handleServerAction`:

- src/components/modals/DeleteAccountModal.tsx
- src/hooks/useWorkout.ts

And check corresponding server-side api routes for creating correct `TApiResponse` data.

---

NextResponse.json:

- src/app/api/questions/[questionId]/route.ts

---

addNewAnswer
deleteAnswer
getQuestionAnswers
updateAnswer
addNewQuestion
deleteQuestion
getQuestion
getTopicQuestions
updateQuestion
getSettings
updateSettings
addNewTopic
checkIfTopicExists
deleteTopic
getAllUsersTopics
getAvailableTopics
getThisUserTopics
getTopic
updateTopic
checkIfUserExists
createUserOrUpdateTelegramUser
deleteUser
getUserByEmail
getUserById
getUsersByIdsList

(addNewAnswer|deleteAnswer|getQuestionAnswers|updateAnswer|addNewQuestion|deleteQuestion|getQuestion|getTopicQuestions|updateQuestion|getSettings|updateSettings|addNewTopic|checkIfTopicExists|deleteTopic|getAllUsersTopics|getAvailableTopics|getThisUserTopics|getTopic|updateTopic|checkIfUserExists|createUserOrUpdateTelegramUser|deleteUser|getUserByEmail|getUserById|getUsersByIdsList)

Add (?):

src/features/questions/actions/addNewQuestion.ts
src/features/questions/actions/deleteQuestion.ts
src/features/questions/actions/getQuestion.ts
src/features/settings/actions/getSettings.ts
src/features/topics/actions/addNewTopic.ts
src/features/topics/actions/checkIfTopicExists.ts
src/features/topics/actions/deleteTopic.ts
src/features/topics/actions/getAllUsersTopics.ts
src/features/users/actions/checkIfUserExists.ts
src/features/users/actions/createUserOrUpdateTelegramUser.ts
src/features/users/actions/deleteUser.ts
src/features/users/actions/getUserByEmail.ts
src/features/users/actions/getUserById.ts
src/features/users/actions/getUsersByIdsList.ts

Remove:

src/features/answers/actions/addNewAnswer.ts
src/features/answers/actions/deleteAnswer.ts
src/features/answers/actions/getQuestionAnswers.ts
src/features/answers/actions/updateAnswer.ts
src/features/questions/actions/getTopicQuestions.ts
src/features/questions/actions/updateQuestion.ts
src/features/settings/actions/updateSettings.ts
src/features/topics/actions/getAvailableTopics.ts
src/features/topics/actions/getThisUserTopics.ts
src/features/topics/actions/getTopic.ts
src/features/topics/actions/updateTopic.ts

(addNewAnswer|deleteAnswer|getQuestionAnswers|updateAnswer|getTopicQuestions|updateQuestion|updateSettings|getAvailableTopics|getThisUserTopics|getTopic|updateTopic)

I'm sorry, let's roolback some changes.

Let's completely remove usage of `TApiResponse` data from the server action functions and leave it only in api routes.

So, the 1st step is: we have to rollback `TApiResponse` from the following server functions (actions):

- addNewAnswer: src/features/answers/actions/addNewAnswer.ts
- deleteAnswer: src/features/answers/actions/deleteAnswer.ts
- getQuestionAnswers: src/features/answers/actions/getQuestionAnswers.ts
- updateAnswer: src/features/answers/actions/updateAnswer.ts
- getTopicQuestions: src/features/questions/actions/getTopicQuestions.ts
- updateQuestion: src/features/questions/actions/updateQuestion.ts
- updateSettings: src/features/settings/actions/updateSettings.ts
- getAvailableTopics: src/features/topics/actions/getAvailableTopics.ts
- getThisUserTopics: src/features/topics/actions/getThisUserTopics.ts
- getTopic: src/features/topics/actions/getTopic.ts
- updateTopic: src/features/topics/actions/updateTopic.ts

And, wherever they are used, let's create coresponding api routes (with `TApiResponse` usage) and reaplace all invocations of these functions by fetching of data from these api routes.

So, the 2nd step is: For the following client side components replace calls of the specified server functions with newly created api routes (with the corresponding paths, respectively).

Ask me about specific route paths in case of troubles (if it isn't obsvious).

- src/components/pages/ManageTopicQuestionAnswers/AddAnswerModal/AddAnswerModal.tsx: addNewAnswer
- src/components/pages/ManageTopicQuestionAnswers/DeleteAnswerModal/DeleteAnswerModal.tsx: deleteAnswer
- src/components/pages/ManageTopicQuestionAnswers/EditAnswerCard/EditAnswerForm.tsx: updateAnswer
- src/components/pages/ManageTopicQuestions/EditQuestionCard/EditQuestionForm.tsx: updateQuestion
- src/components/pages/ManageTopicsPage/EditTopicCard/EditTopicForm.tsx: updateTopic
- src/contexts/SettingsContext/SettingsContext.tsx: updateSettings (wrap with `handleApiResponse`)

---

Can you suggest an approach to integrate react query to the available topics list?

See the module `src/components/pages/AvailableTopics/AvailableTopicsListWrapper.tsx` and it's descendants.

Don't apply any changes at first, let approve the general approach.

---

There's already a general purpose api route to fetch available topics: `src/app/api/topics/route.ts` it could be parametrized later.

And it already supports `skip` and `take` parameters to support incremental data loading (which is used currently). So, we can use `useInfiniteQuery` hook.

Let's try to implement this.

---

Don't use axios. Use fetch.

Take a look at the example of api fetchng in the src/components/pages/ManageTopicQuestions/ManageTopicQuestionsListCard.tsx, please use this scheme.

Pay attention to usage of handleApiResponse to process api requests. Notify onInvalidateKeys to pass an invalidation hook (you have to get this hook via useInvalidateReactQueryKeys if it's absent), debugDetails to provide debug information, catch section with error logging, debug stop (add eslint warning stopper comments) and error toast.

Don't forget also to add typescropt types where they are missed.

---

Help to solve the bug:

The client (from useAvailableTopics) calls api route via /api/topics?skip=0&take=10, but the src/app/api/topics/route.ts gets nothing in params parameter (and the same is in the searchParams).

How can I correctly get url quesry params in nextjs route?

--

How to sort by related object's field in Prisma?

I have the following schema:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  topics Topic[]
  userTopicWorkout UserTopicWorkout[]
  @@map("users")
}

model Topic {
  id String @id @default(cuid())
  name String
  userTopicWorkout UserTopicWorkout[]
  @@index([userId])
  @@map("topics")
}

model UserTopicWorkout {
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId String @map("topic_id")
  topic   Topic  @relation(fields: [topicId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @map("updated_at")
  @@id([userId, topicId])
  @@map("user_topic_workouts")
}
```

Each user and each topic has a list of `userTopicWorkout`. But each `userTopicWorkout` for the user and the topic (so, the user has only one `userTopicWorkout` per a topic).

And I want to sort topics by the related `userTopicWorkout` object's `updatedAt` date for the given user.

I've tried to achieve that by the following command:

```ts
const topics = await jestPrisma.topic.findMany({
  where: { userId: user.id, id: { in: topicIds } },
  include: {
    userTopicWorkout: {
      select: {
        updatedAt: true,
      },
    },
  },
  orderBy: { userTopicWorkout: { updatedAt: 'desc' } },
});
```

But I'm getting the following typescript error:

```
Type '{ userTopicWorkout: { updatedAt: string; }; }' is not assignable to type 'TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[] | undefined'.
  Types of property 'userTopicWorkout' are incompatible.
    Object literal may only specify known properties, and 'updatedAt' does not exist in type 'UserTopicWorkoutOrderByRelationAggregateInput'.ts(2322)
```

How can I achieve the goal and sort topics by related `userTopicWorkout`?

-->

The only solution is to fetch `prisma.userTopicWorkout`:

```javascript
const userTopicWorkouts = await prisma.userTopicWorkout.findMany({
  where: {
    userId: user.id,
    topicId: { in: topicIds },
  },
  orderBy: {
    updatedAt: 'desc',
  },
  include: {
    topic: true,
  },
});
const topicsSortedByUpdatedAt = userTopicWorkouts.map((utw) => utw.topic);
```
