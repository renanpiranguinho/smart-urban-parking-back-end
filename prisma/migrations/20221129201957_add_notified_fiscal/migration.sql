-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "notified_fiscal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notified_fiscal_at" TIMESTAMP(3);
