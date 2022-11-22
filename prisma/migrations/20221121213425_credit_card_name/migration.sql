/*
  Warnings:

  - Added the required column `cardName` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "cardName" TEXT NOT NULL;
