/*
  Warnings:

  - A unique constraint covering the columns `[genre]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- CreateIndex
CREATE UNIQUE INDEX "Genre_genre_key" ON "Genre"("genre");
