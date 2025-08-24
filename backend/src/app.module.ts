import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { CodeGenerateService } from './email/code-generate.service';
import { AppService } from './app.service';
import { PasswordHashService } from './auth/password-hash.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    MongooseModule.forRoot('mongodb://localhost:27017/concept-revise'),

    EmailModule,
    AuthModule,

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PasswordHashService, CodeGenerateService],
})
export class AppModule {}
