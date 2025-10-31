-- CreateTable
CREATE TABLE "workout_stats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "ratio" INTEGER NOT NULL,
    "time_seconds" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workout_stats_user_id_idx" ON "workout_stats"("user_id");

-- CreateIndex
CREATE INDEX "workout_stats_topic_id_idx" ON "workout_stats"("topic_id");

-- CreateIndex
CREATE INDEX "workout_stats_user_id_topic_id_idx" ON "workout_stats"("user_id", "topic_id");

-- AddForeignKey
ALTER TABLE "workout_stats" ADD CONSTRAINT "workout_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_stats" ADD CONSTRAINT "workout_stats_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_stats" ADD CONSTRAINT "workout_stats_user_id_topic_id_fkey" FOREIGN KEY ("user_id", "topic_id") REFERENCES "user_topic_workouts"("user_id", "topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "user_topic_workouts" DROP COLUMN "total_rounds",
DROP COLUMN "all_ratios",
DROP COLUMN "all_times",
DROP COLUMN "average_ratio",
DROP COLUMN "average_time";