import { Controller, Post, Body } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('check')
  async checkUniqueEmail(@Body('email') email: string) {
    const exists = await this.emailService.checkUniqueEmail(email);
    return { exists };
  }
}
