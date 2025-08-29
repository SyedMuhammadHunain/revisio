import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsString,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Please enter a valid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one number and one special character',
  })
  password: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'Please enter a valid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @MinLength(4, { message: 'Minimum length of code is 4' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Code must contains only Uppercase Alphabets and Numbers',
  })
  @IsNotEmpty({ message: 'Code cannot be empty' })
  code: string;
}
