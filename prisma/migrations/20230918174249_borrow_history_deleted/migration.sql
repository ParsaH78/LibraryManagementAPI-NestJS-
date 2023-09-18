/*
  Warnings:

  - You are about to drop the `Borrow_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Borrow_history" DROP CONSTRAINT "Borrow_history_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Borrow_history" DROP CONSTRAINT "Borrow_history_borrow_id_fkey";

-- DropForeignKey
ALTER TABLE "Borrow_history" DROP CONSTRAINT "Borrow_history_user_id_fkey";

-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- DropTable
DROP TABLE "Borrow_history";
