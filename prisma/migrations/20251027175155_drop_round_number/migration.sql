/*
  Warnings:

  - You are about to drop the column `round_number` on the `workout_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_stats" DROP COLUMN IF EXISTS "round_number";
