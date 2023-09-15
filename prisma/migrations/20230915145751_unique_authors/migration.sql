/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
