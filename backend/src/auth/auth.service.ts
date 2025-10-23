import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { PasswordHashService } from './password-hash.service';
import { EmailService } from '../email/email.service';
import { CodeGenerateService } from '../email/code-generate.service';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { Auth, AuthDocument } from '../schemas/auth.schema';

import { SigninDto, SignupDto } from '../dtos/auth.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    private readonly jwtService: JwtService,
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
      console.error('Email sending failed:', error);
    }

    return {
      message:
        "You've successfully signed up! Please check your email for the verification code.",
    };
  }

  async signIn(signinDto: SigninDto) {
    const { email, password, code } = signinDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Password does not match.');

    const authRecord = await this.authModel.findOne({ email, code });
    if (!authRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (authRecord.expiresAt < new Date()) {
      throw new BadRequestException(
        'Verification code expired. Please request a new one.',
      );
    }

    if (!user.isVerified) {
      await this.userModel.updateOne({ email }, { isVerified: true });
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.authModel.deleteOne({ _id: authRecord._id });

    return {
      message: 'Login successful',
      accessToken,
    };
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const code = this.codeGenerateService.generateOTP();
    const expiresAt = this.codeGenerateService.calculateCodeExpiry();

    await this.authModel.deleteMany({ email });
    await new this.authModel({ email, code, expiresAt }).save();

    await this.emailService.sendCodeToEmail(email, code);

    return { message: 'A new OTP has been sent to your email' };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('Email not registered');

    const code = this.codeGenerateService.generateOTP();
    const expiresAt = this.codeGenerateService.calculateCodeExpiry();

    await this.authModel.deleteMany({ email });
    await new this.authModel({ email, code, expiresAt }).save();

    await this.emailService.sendCodeToEmail(email, code);

    return { message: 'Reset code sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;

    const authRecord = await this.authModel.findOne({ email, code });
    if (!authRecord) throw new BadRequestException('Invalid or expired code');

    if (authRecord.expiresAt < new Date()) {
      throw new BadRequestException('Code expired, request a new one');
    }

    const hashedPassword =
      await this.passwordHashService.hashPassword(newPassword);
    await this.userModel.updateOne({ email }, { password: hashedPassword });

    await this.authModel.deleteMany({ email });

    return { message: 'Password reset successfully' };
  }
}
