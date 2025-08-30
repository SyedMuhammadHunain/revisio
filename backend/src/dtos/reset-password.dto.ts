import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(4, { message: 'Password must be at least 4 characters long.' })
  @Matches(/^(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'Password must include a number and a special character.',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'Code is required.' })
  @MinLength(6, { message: 'Code must be exactly 6 characters.' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Code must contain only uppercase letters and digits.',
  })
  code: string;
}
