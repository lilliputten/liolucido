-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserGrade" AS ENUM ('GUEST', 'MEMBER', 'PREMIUM');

-- Add grade column
ALTER TABLE "users" ADD COLUMN "grade" "UserGrade" NOT NULL DEFAULT 'GUEST';

-- Add temporary role column with enum type
ALTER TABLE "users" ADD COLUMN "role_new" "UserRole" NOT NULL DEFAULT 'USER';

-- Update the new role column based on existing string values
UPDATE "users" SET "role_new" = 
  CASE 
    WHEN "role" = 'ADMIN' THEN 'ADMIN'::"UserRole"
    ELSE 'USER'::"UserRole"
  END;

-- Drop the old role column
ALTER TABLE "users" DROP COLUMN "role";

-- Rename the new column to the original name
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";