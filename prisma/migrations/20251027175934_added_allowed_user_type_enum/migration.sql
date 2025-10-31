/*
  Warnings:

  - The `type` column on the `allowed_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AllowedUserType" AS ENUM ('EMAIL', 'TELEGRAM');

-- AlterTable
ALTER TABLE "allowed_users" DROP COLUMN "type",
ADD COLUMN     "type" "AllowedUserType" NOT NULL DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX "allowed_users_type_value_key" ON "allowed_users"("type", "value");
