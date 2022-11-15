import { Role } from 'src/models/users/enums/role.enum';

export class LoginUserDto {
  id: number;
  role: Role;
  is_active: boolean;
}
