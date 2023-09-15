-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_borrower_id_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "borrower_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
