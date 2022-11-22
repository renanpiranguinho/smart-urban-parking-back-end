import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsNumber(
    {},
    {
      message: 'latitude must be a number',
    },
  )
  @IsNotEmpty({
    message: 'latitude is required',
  })
  latitude: number;

  @IsNumber(
    {},
    {
      message: 'longitude must be a number',
    },
  )
  @IsNotEmpty({
    message: 'longitude is required',
  })
  longitude: number;

  @IsString({
    message: 'region must be a string',
  })
  @IsNotEmpty({
    message: 'region is required',
  })
  region: string;

  @IsNumber(
    {},
    {
      message: 'price must be a number',
    },
  )
  @IsNotEmpty({
    message: 'price is required',
  })
  price: number;

  @IsNumber(
    {},
    {
      message: 'parking_lots must be a number',
    },
  )
  @IsNotEmpty({
    message: 'parking_lots is required',
  })
  parking_lots: number;
}
