/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cover_pic` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_book_id_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "cover_pic" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
