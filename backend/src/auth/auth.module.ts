import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHashService } from './password-hash.service';
import { CodeGenerateService } from 'src/email/code-generate.service';

import { User, UserSchema } from 'src/schemas/user.schema';
import { Auth, AuthSchema } from 'src/schemas/auth.schema';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHashService, CodeGenerateService],
})
export class AuthModule {}
