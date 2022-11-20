/*
  Warnings:

  - You are about to drop the column `purchase_by_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_to_id` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `cpf` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_plate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_purchase_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_purchase_to_id_fkey";

-- DropIndex
DROP INDEX "Payment_payment_id_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "purchase_by_id",
DROP COLUMN "purchase_to_id",
ADD COLUMN     "buyer_id" INTEGER,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "license_plate" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "valid_until" TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "payment_id" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
