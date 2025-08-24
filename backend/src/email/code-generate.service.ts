import { Injectable } from '@nestjs/common';

import * as otp from 'otp-generator';

@Injectable()
export class CodeGenerateService {
  generateOTP(): string {
    return otp.generate(6, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }

  calculateCodeExpiry(): Date {
    return new Date(Date.now() + 10 * 60 * 1000);
  }
}
