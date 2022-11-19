/*
  Warnings:

  - Made the column `flag` on table `CreditCard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CreditCard" ALTER COLUMN "flag" SET NOT NULL;
