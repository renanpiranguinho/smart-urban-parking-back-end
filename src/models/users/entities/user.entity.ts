import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User {
  id: number;
  name: string;
  cpf: string;
  email: string;

  @Exclude()
  password?: string;

  is_active: boolean;
  role: Role;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
