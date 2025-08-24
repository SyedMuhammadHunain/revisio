import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignupDto } from 'src/dtos/signup.dto';
import { VerifyDto } from 'src/dtos/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('verify')
  async verifyCode(@Body() verifyDto: VerifyDto) {
    return this.authService.verifyCode(verifyDto);
  }
}
