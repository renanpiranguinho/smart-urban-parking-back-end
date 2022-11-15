import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  owner_id?: number;

  @IsNotEmpty({ message: 'Car name is not found' })
  @IsString({ message: 'Name format is invalid' })
  name: string;

  @IsNotEmpty({ message: 'License plate is not found' })
  @IsString({ message: 'License plate format is invalid' })
  license_plate: string;
}
