export class Vehicle {
  id: number;
  name: string;
  license_plate: string;

  created_at: Date;
  updated_at?: Date;

  constructor(vehicle: Partial<Vehicle>) {
    Object.assign(this, vehicle);
  }
}
