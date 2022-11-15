export class Car {
  id: number;
  owner_id: number;
  name: string;
  license_plate: string;

  created_at: Date;
  updated_at?: Date;

  constructor(car: Partial<Car>) {
    Object.assign(this, car);
  }
}
