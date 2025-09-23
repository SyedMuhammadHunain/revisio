import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { TestConfigModule } from './test-config/test-config.module';
import { TestResultsModule } from './test-results/test-results.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true, // Add this
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URL');
        console.log('MongoDB URI configured');

        return {
          uri,
          retryWrites: true,
          w: 'majority',
        };
      },
    }),

    // Fix MailerModule to use ConfigService
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
      }),
    }),

    EmailModule,
    AuthModule,
    QuestionsModule,
    TestConfigModule,
    TestResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}