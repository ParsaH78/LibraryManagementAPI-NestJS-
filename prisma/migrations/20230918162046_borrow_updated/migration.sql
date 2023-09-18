-- DropForeignKey
ALTER TABLE "Borrow_history" DROP CONSTRAINT "Borrow_history_borrow_id_fkey";

-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- AddForeignKey
ALTER TABLE "Borrow_history" ADD CONSTRAINT "Borrow_history_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "Borrows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
