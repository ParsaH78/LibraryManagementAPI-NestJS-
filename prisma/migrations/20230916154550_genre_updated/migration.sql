-- DropForeignKey
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_book_id_fkey";

-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "book_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
