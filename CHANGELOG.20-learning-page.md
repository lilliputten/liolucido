https://github.com/lilliputten/trainwizzz/issues/20
Create learning page for the available topic.
20-learning-page

- Using `useGoBack()` hook, using a route `/topics/available/${id}/workout` for a topic training page.
- Created workout pages and api routes.
- Using zod-prisma-types provider for prisma orm. Created a component to resume/start/restart workout.
- Added WorkoutContext.
- Using prisma from '@/generated/prisma'.
- Added workout question page, question answers api route. Requred debug & fixes.
- Finished topic workout logic in general.
- Fixed WelcomeScreen gradient splash layout bug.
- Minior configuraiton changes.
- Workout topic changes: updated buttons, displaying skeletons while answers data is loading, added placeholders for the future progress and stats info data.
- Added markdown support, added summary sections for topic, question, answer manage pages, fixed minor data related issues.
- Renamed Markdown -> MarkdownText to avoid disambiguation with dependency package of the same name, changes data received by ViewAvailableTopic (using topic data, but not it's id).
- Fixed "Add new..." and "Delete..." modals for topics, questions and answers. Extracted shared `FormHint` block, updated markdown truncate logic. Fixed action button icons. Fixed missed workout topic breadcrumb issue.
- Added workout update code topic question removing or creation:
- Minor fixes. Tested the workout updates with real topics' data.
