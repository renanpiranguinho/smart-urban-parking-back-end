-- DropForeignKey
ALTER TABLE "UserVehicles" DROP CONSTRAINT "UserVehicles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserVehicles" DROP CONSTRAINT "UserVehicles_vehicle_id_fkey";

-- AddForeignKey
ALTER TABLE "UserVehicles" ADD CONSTRAINT "UserVehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicles" ADD CONSTRAINT "UserVehicles_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
