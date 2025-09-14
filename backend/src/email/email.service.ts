import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { MailerService } from '@nestjs-modules/mailer';

import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async checkUniqueEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !!user;
  }

  async sendCodeToEmail(email: string, code: string) {
    console.log(code);
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

    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Your OTP Code',
      html: htmlTemplate,
    });
  }
}
