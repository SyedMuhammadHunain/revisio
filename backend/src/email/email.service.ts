import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private from: string;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.from = this.configService.get<string>('EMAIL_FROM') ?? 'onboarding@resend.dev';
  }

  async checkUniqueEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !!user;
  }

  async sendCodeToEmail(email: string, code: string) {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>OTP Code</title>
    </head>
    <body>
      <h2>Your OTP Code</h2>
      <p>Use the code below to verify your email:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
      <br>
      <p>Best regards,<br>Revisio</p>
    </body>
    </html>
    `;

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Your OTP Code',
      html: htmlTemplate,
    });
  }
}
