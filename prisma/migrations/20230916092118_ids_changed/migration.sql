/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Score" DROP CONSTRAINT "Score_pkey",
ADD CONSTRAINT "Score_pkey" PRIMARY KEY ("id");
