import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from 'src/schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async checkUniqueEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return true;
    }
    return false;
  }
}
