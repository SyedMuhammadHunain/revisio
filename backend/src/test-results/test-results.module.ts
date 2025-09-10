import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TestResult, TestResultSchema } from 'src/schemas/test-result.schema';
import { QuestionSchema, Question } from 'src/schemas/question.schema';
import {
  TestConfigSchema,
  TestConfig,
} from 'src/schemas/test-configuration.schema';

import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';

import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

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
      { name: TestResult.name, schema: TestResultSchema },
      { name: TestConfig.name, schema: TestConfigSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [TestResultsController],
  providers: [TestResultsService, JwtAuthGuard],
  exports: [TestResultsService],
})
export class TestResultsModule {}
