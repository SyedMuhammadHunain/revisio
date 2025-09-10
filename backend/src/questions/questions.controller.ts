import { Controller, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // This endpoint is for development/admin use to populate sample questions
  @Post('seed')
  async createSampleQuestions() {
    await this.questionsService.createSampleQuestions();
    return { message: 'Sample questions created successfully' };
  }
}
