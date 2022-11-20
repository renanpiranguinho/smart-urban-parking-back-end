/*
  Warnings:

  - The `payment_id` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_id",
ADD COLUMN     "payment_id" INTEGER;
