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
    const htmlTemplate = `
    <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Code</title>
  </head>
  <body style="margin:0; padding:0; background-color:#121212; font-family:Arial, sans-serif; color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#121212; width:100%; text-align:center;">
      <tr>
        <td style="padding:40px 15px;">
          <!-- Main Content -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; margin:auto; background-color:#1e1e1e; border-radius:10px; padding:30px;">
            <tr>
              <td align="center">
                <h2 style="color:#ffffff; margin-bottom:15px;">Your OTP Code</h2>
                <p style="color:#bbbbbb; font-size:16px; margin-bottom:20px;">Use the code below to verify your email:</p>
                
                <div style="display:flex; justify-content:center; gap:15px; font-size:32px; font-weight:bold; letter-spacing:5px; padding:15px; border-radius:8px; background-color:#2a2a2a; margin-bottom:20px;">
                  ${code
                    .split('')
                    .map((c) => `<span>${c}</span>`)
                    .join('')}
                </div>
                
                <p style="color:#888888; font-size:14px;">This code expires in 10 minutes.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer with big "Revisio" text -->
      <tr>
        <td style="padding-top:40px; text-align:center;">
          <p style="font-size:12rem; font-weight:bold; color:rgba(60, 59, 59, 0.2); margin:0; text-transform:uppercase;">
            Revisio
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      html: htmlTemplate, // Use HTML template instead of text
    });
  }
}
