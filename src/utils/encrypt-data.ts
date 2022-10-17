import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class EncryptData {
  async encrypt(text: string, salt: number): Promise<string> {
    const passwordHash = await hash(text, salt);

    return passwordHash;
  }

  async decrypt(text: string, hash: string): Promise<boolean> {
    const passwordHasMatch = await compare(text, hash);

    return passwordHasMatch;
  }
}
