/*
  Warnings:

  - Changed the type of `expirationMonth` on the `CreditCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expirationYear` on the `CreditCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "expirationMonth",
ADD COLUMN     "expirationMonth" INTEGER NOT NULL,
DROP COLUMN "expirationYear",
ADD COLUMN     "expirationYear" INTEGER NOT NULL;
