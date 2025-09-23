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
      expandVariables: true,
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

    // Fixed MailerModule configuration
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail', // Use Gmail service
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          // Additional Gmail-specific settings
          pool: true,
          maxConnections: 1,
          rateDelta: 20000,
          rateLimit: 5,
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
      }),
    }),

    // Alternative configuration if Gmail service doesn't work
    // MailerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get<string>('EMAIL_HOST'),
    //       port: parseInt(configService.get<string>('EMAIL_PORT', '587')),
    //       secure: configService.get<string>('EMAIL_SECURE') === 'true', // false for 587, true for 465
    //       auth: {
    //         user: configService.get<string>('EMAIL_USERNAME'),
    //         pass: configService.get<string>('EMAIL_PASSWORD'),
    //       },
    //       tls: {
    //         rejectUnauthorized: false,
    //       },
    //       // Timeout settings
    //       connectionTimeout: 60000, // 60 seconds
    //       greetingTimeout: 30000,   // 30 seconds
    //       socketTimeout: 60000,     // 60 seconds
    //     },
    //     defaults: {
    //       from: configService.get<string>('EMAIL_FROM'),
    //     },
    //   }),
    // }),

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
