import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import {
  Injectable,
  PipeTransform,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class VehiclePipe implements PipeTransform {
  async transform({
    owner_id,
    name,
    license_plate,
  }: CreateVehicleDto | UpdateVehicleDto): Promise<
    CreateVehicleDto | UpdateVehicleDto
  > {
    let licensePlate = license_plate;

    if (license_plate) {
      const licenseHasValid = license_plate.match(
        '^[a-zA-Z]{3}-?[0-9][A-Za-z0-9][0-9]{2}$',
      );

      if (!licenseHasValid) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'License plate not match with requirements',
        });
      }

      const licenseFormatted = license_plate.replace(/[\-]/g, '').toUpperCase();

      licensePlate = licenseFormatted;
    }

    return {
      owner_id,
      name,
      license_plate: licensePlate,
    };
  }
}
