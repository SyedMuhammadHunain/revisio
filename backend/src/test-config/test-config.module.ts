import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TestConfig,
  TestConfigSchema,
} from 'src/schemas/test-configuration.schema';
import { TestConfigService } from './test-config.service';
import { TestConfigController } from '../test-config/test-config.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { Question, QuestionSchema } from 'src/schemas/question.schema';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    MongooseModule.forFeature([
      { name: TestConfig.name, schema: TestConfigSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
    QuestionsModule,
  ],
  controllers: [TestConfigController],
  providers: [TestConfigService, JwtAuthGuard],
  exports: [TestConfigService],
})
export class TestConfigModule {}
