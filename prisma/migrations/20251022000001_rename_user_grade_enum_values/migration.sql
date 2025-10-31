-- Rename UserGrade enum values: MEMBER -> BASIC, PREMIUM -> PRO

-- Remove default constraint temporarily
ALTER TABLE "users" ALTER COLUMN "grade" DROP DEFAULT;

-- Recreate the enum with new values
ALTER TYPE "UserGrade" RENAME TO "UserGrade_old";
CREATE TYPE "UserGrade" AS ENUM ('GUEST', 'BASIC', 'PRO');

-- Update the column with data mapping
ALTER TABLE "users" ALTER COLUMN "grade" TYPE "UserGrade" USING (
  CASE "grade"::text
    WHEN 'MEMBER' THEN 'BASIC'::"UserGrade"
    WHEN 'PREMIUM' THEN 'PRO'::"UserGrade"
    ELSE "grade"::text::"UserGrade"
  END
);

-- Restore default constraint with new enum value
ALTER TABLE "users" ALTER COLUMN "grade" SET DEFAULT 'GUEST'::"UserGrade";

DROP TYPE "UserGrade_old";