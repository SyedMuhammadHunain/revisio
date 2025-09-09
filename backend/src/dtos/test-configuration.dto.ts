import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsArray,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTestConfigDto {
  @IsNotEmpty({ message: 'Test name is required' })
  @MinLength(3, { message: 'Test name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Test name must not exceed 50 characters' })
  testName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Number of questions is required' })
  @IsNumber({}, { message: 'Number of questions must be a number' })
  @Min(5, { message: 'Minimum 5 questions required' })
  numOfQuestions: number;

  @IsNotEmpty({ message: 'At least one category must be selected' })
  @IsArray({ message: 'Categories must be an array' })
  categories: string[];
}

export class StartTestDto {
  @IsNotEmpty({ message: 'Test config ID is required' })
  testConfigId: string;
}

export class SubmitAnswerDto {
  @IsNotEmpty({ message: 'Question ID is required' })
  questionId: string;

  @IsNotEmpty({ message: 'Selected answer is required' })
  @IsNumber({}, { message: 'Selected answer must be a number' })
  selectedAnswer: number;
}

export class SubmitTestDto {
  @IsNotEmpty({ message: 'Test config ID is required' })
  testConfigId: string;

  @IsArray({ message: 'Answers must be an array' })
  answers: {
    questionId: string;
    selectedAnswer: number;
  }[];

  @IsNotEmpty({ message: 'Start time is required' })
  startTime: Date;

  @IsNotEmpty({ message: 'End time is required' })
  endTime: Date;

  cheatingDetected?: boolean;
  warningsGiven?: number;
}
