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
import { TestConfigService } from './test-config.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import {
  CreateTestConfigDto,
  StartTestDto,
} from '../dtos/test-configuration.dto';

@Controller('test-config')
@UseGuards(JwtAuthGuard)
export class TestConfigController {
  constructor(private readonly testConfigService: TestConfigService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createTestConfig(
    @Body() createTestConfigDto: CreateTestConfigDto,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.testConfigService.createTestConfig(createTestConfigDto, userId);
  }

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startTest(@Body() startTestDto: StartTestDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.testConfigService.startTest(startTestDto.testConfigId, userId);
  }

  @Get('user-configs')
  async getUserTestConfigs(@Request() req: any) {
    const userId = req.user.sub;
    return this.testConfigService.getUserTestConfigs(userId);
  }

  @Get(':id')
  async getTestConfig(@Param('id') testConfigId: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.testConfigService.getTestConfig(testConfigId, userId);
  }
}
