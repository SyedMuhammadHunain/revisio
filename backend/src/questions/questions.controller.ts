import { Controller, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from '../dtos/questions.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // This endpoint is for development/admin use to populate sample questions
  @Post('seed')
  async createSampleQuestions(@Body() createQuestionDto: CreateQuestionDto) {
    await this.questionsService.createSampleQuestions(createQuestionDto);
    return { message: 'Sample questions created successfully' };
  }
}
