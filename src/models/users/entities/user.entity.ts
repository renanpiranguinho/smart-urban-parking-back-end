import { Exclude } from 'class-transformer';

export class User {
  id: string;
  username: string;
  email: string;

  @Exclude()
  password?: string;

  avatar_url: string;
  is_admin: boolean;
  is_active: boolean;
  favorite_movie: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
