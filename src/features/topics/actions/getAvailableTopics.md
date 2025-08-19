# getAvailableTopics

## Query:

Create tests for `getAvailableTopics` server function (see `src/features/topics/actions/getAvailableTopics.ts`) to check different cases:

- Unauthorized user can get only public records.
- Authorized user can get public (by default) or his own records (with `showOnlyMyTopics`). By default this user should get both his own and public data.
- Admin users (with role="ADMIN") are allowed to get all the data if `adminMode` has been passed.

Check also other parameters:

- `includeUser`: should provide extra user info.
- `includeQuestionsCount`: should calculate related questions count.
- `orderBy`: Suggest different useful sort modes, according to `Topic` model in the `prisma/schema.prisma` schema (eg: by questions count, by name (alphabetical) last active workout time, what else? suggest some).

Check pagination with `skip` and `take` parameters (involve `totalCount`).

Keep in mind that we use 'jest', use `jestPrisma` (from `import { jestPrisma } from '@/lib/db/jestPrisma'`), remember that there are possible simultaneous tests execution and in order to cope with it the tests are required to cleanup their own created data (to store created entities ids and remove them when done, see examples).

Use `src/features/questions/actions/__tests__/addNewQuestion.test.ts` for example.

---

Don't use shared createdIds -- the data might be mixed and overriden. Store created ids in the respective tests. See the approach in the src/features/questions/actions/**tests**/addNewQuestion.test.ts.

Create also a orderBy sort test case for sort by most recent related workout (UserTopicWorkout model) -- probably, it'll require update the getAvailableTopicsSchema (to fetch extra data).

Don't call `Date.now` several times in the same function -- it might produce different values. Use the re-used value (`const nowMs = Date.now()`).

Apparenlty, would it better to check for undefined/falsy values instead of `expect(topics[0].user).toBe(false)`?

Make sure that you clean all the temp data created with (`setupUserAndTopics`) -- sometimes only some data used and cleand up: `const { publicTopic } = await setupUserAndTopics(createdIds);`.

Run created tests when done to check for errors.
