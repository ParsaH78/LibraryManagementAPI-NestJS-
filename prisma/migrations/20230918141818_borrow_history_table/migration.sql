-- AlterTable
ALTER TABLE "Borrows" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 DAYS';

-- CreateTable
CREATE TABLE "Borrow_history" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "borrow_id" TEXT NOT NULL,

    CONSTRAINT "Borrow_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Borrow_history_book_id_key" ON "Borrow_history"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "Borrow_history_borrow_id_key" ON "Borrow_history"("borrow_id");

-- AddForeignKey
ALTER TABLE "Borrow_history" ADD CONSTRAINT "Borrow_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow_history" ADD CONSTRAINT "Borrow_history_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow_history" ADD CONSTRAINT "Borrow_history_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "Borrows"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
