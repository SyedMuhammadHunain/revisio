import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { PasswordHashService } from './password-hash.service';
import { EmailService } from 'src/email/email.service';
import { CodeGenerateService } from 'src/email/code-generate.service';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from 'src/schemas/user.schema';
import { Auth, AuthDocument } from 'src/schemas/auth.schema';

import { SignupDto } from 'src/dtos/signup.dto';
import { VerifyDto } from 'src/dtos/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
    private readonly passwordHashService: PasswordHashService,
    private readonly codeGenerateService: CodeGenerateService,
    private readonly emailService: EmailService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const exists = await this.userModel.findOne({ email });

    if (exists && exists.isVerified) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword =
      await this.passwordHashService.hashPassword(password);

    let user = exists;
    if (!user) {
      user = await new this.userModel({
        username,
        email,
        password: hashedPassword,
      }).save();
    }

    const code = this.codeGenerateService.generateOTP();
    const expiresAt = this.codeGenerateService.calculateCodeExpiry();

    await this.authModel.deleteMany({ email });
    await new this.authModel({
      email,
      code,
      expiresAt,
    }).save();

    try {
      await this.emailService.sendCodeToEmail(email, code);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email: ', error);
    }

    return {
      message:
        "You've successfully signed up! Please check your email for the verification code.",
    };
  }

  async verifyCode(verifyDto: VerifyDto) {
    const { email, code } = verifyDto;

    const authDoc = await this.authModel.findOne({
      email,
      code,
    });

    if (!authDoc) {
      throw new UnauthorizedException(
        'Failed to verify code. Please check your credentials',
      );
    }

    if (authDoc.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Code has been expired. Please request a new one',
      );
    }

    await this.userModel.updateOne({ email }, { isVerified: true });
    await this.authModel.deleteMany({ email });

    return { message: 'Email verified successfully' };
  }
}
