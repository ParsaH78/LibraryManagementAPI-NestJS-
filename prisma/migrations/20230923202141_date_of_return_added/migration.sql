-- AlterTable
ALTER TABLE "Borrows" ADD COLUMN     "date_of_return" TIMESTAMP(3),
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';
