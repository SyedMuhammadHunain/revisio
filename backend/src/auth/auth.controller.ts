import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignupDto, SigninDto } from 'src/dtos/auth.dto';
import { VerifyDto } from 'src/dtos/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  async signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }

  @Post('verify')
  async verifyCode(@Body() verifyDto: VerifyDto) {
    return this.authService.verifyCode(verifyDto);
  }
}
