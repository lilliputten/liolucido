Take a look at the Workout data schema, `UserTopicWorkout` in `prisma/schema.prisma`.

I want to move overall, statistic and calculable fields (and may be some others? suggest it):

```
  totalRounds      Int       @default(0) @map("total_rounds")
  allRatios        String    @default("") @map("all_ratios")
  allTimes         String    @default("") @map("all_times")
  averageRatio     Int       @default(0) @map("average_ratio")
  averageTime      Int       @default(0) @map("average_time")
```

-- to the dedicated `WorkoutStats` data table, where one row represent one finished workout round. New records should be added there on workout finish (see `finishWorkout` callback in the `src/hooks/react-query/useWorkoutQuery.ts`.

`allRatios` and `allTimes` should become fields in this table (`ratio`, `time`).

Also there must be info about total and correct answers (per row).

And `averageRatio` and `averageTime` must be calculable based on the table rows. (As well as `maxRatio`, `maxTime` and so on). Suggest helper functions to retrieve these data.

Suggest other functions to gather all other possible statistic details, based on the stored data.

Don't forget to check ts errors (via tsc) when done.

First suggest table structure and ongoing changes review to confirm.

---

Generate a text for the welcome user page, to describe the current application, líolúcido, for the following cases:

- A regular user: it can view and work with public trainings, created by other people.
- A logged in user (isLogged): Can create it's own trainings, can view detailed statistics and historical progress.

Create aditional note for admin (isAdmin) users: they can monitor and cnotrol other users data and the users themselves.
