-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'PENDING',
    "method" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchase_to_id" INTEGER NOT NULL,
    "purchase_by_id" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payment_id_key" ON "Payment"("payment_id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_purchase_to_id_fkey" FOREIGN KEY ("purchase_to_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_purchase_by_id_fkey" FOREIGN KEY ("purchase_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
