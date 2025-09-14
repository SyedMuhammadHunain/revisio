// src/questions/dto/create-question.dto.ts
import {
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsArray()
  @ArrayMinSize(2) // at least 2 options
  options: string[];

  @IsInt()
  @Min(0) // must be a valid index
  correctAnswer: number;

  @IsString()
  @IsIn(['DSA', 'OOP', 'PF'])
  category: string;

  @IsInt()
  @Min(1)
  points: number;

  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty: string;
}
