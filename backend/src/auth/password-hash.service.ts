import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw new InternalServerErrorException('Failed to hash password', error);
    }
  }
}
