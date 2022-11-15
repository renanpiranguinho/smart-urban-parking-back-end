import { Role } from 'src/models/users/enums/role.enum';

export class LoginUserDto {
  id: number;
  role: Role;
  cpf: string;
  email: string;
  is_active: boolean;
}
