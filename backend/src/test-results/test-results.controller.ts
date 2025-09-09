import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { SubmitTestDto } from '../dtos/test-configuration.dto';

@Controller('test-results')
@UseGuards(JwtAuthGuard)
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitTest(@Body() submitTestDto: SubmitTestDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.testResultsService.submitTest(submitTestDto, userId);
  }

  @Get('user-results')
  async getUserTestResults(@Request() req: any) {
    const userId = req.user.sub;
    return this.testResultsService.getUserTestResults(userId);
  }
  
  @Get('statistics')
  async getUserStatistics(@Request() req: any) {
    const userId = req.user.sub;
    console.log('Fetching statistics for user:', userId);
    return this.testResultsService.getUserStatistics(userId);
  }

  @Get(':id')
  async getTestResult(@Param('id') testResultId: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.testResultsService.getTestResultById(testResultId, userId);
  }
}
