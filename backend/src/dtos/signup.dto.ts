import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Please enter a valid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one number and one special character',
  })
  password: string;
}
