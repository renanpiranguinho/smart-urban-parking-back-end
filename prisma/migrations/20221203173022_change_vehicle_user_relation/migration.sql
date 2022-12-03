/*
  Warnings:

  - You are about to drop the `UserVehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVehicles" DROP CONSTRAINT "UserVehicles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserVehicles" DROP CONSTRAINT "UserVehicles_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "UserVehicles";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
