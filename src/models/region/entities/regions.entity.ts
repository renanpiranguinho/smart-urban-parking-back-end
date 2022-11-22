export class Region {
  id: number;
  latitude: number;
  longitude: number;
  region: string;
  price: number;
  parking_lots: number;

  constructor(region: Partial<Region>) {
    Object.assign(this, region);
  }
}
