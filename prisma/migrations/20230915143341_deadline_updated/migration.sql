/*
  Warnings:

  - You are about to drop the column `borrower_id` on the `Book` table. All the data in the column will be lost.
  - The `deadline` column on the `Borrows` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_borrower_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Genres" DROP CONSTRAINT "Genres_book_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "borrower_id",
ALTER COLUMN "cover_pic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Borrows" ADD COLUMN     "returned" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "deadline",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '7 DAYS';

-- AlterTable
ALTER TABLE "Score" DROP CONSTRAINT "Score_pkey",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Score_pkey" PRIMARY KEY ("id", "book_id", "user_id");

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Genres";

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id","book_id","user_id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
