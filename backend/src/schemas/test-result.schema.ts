import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestResultDocument = TestResult & Document;

interface Answer {
  questionId: Types.ObjectId;
  selectedAnswer: number;
  isCorrect: boolean;
  points: number;
  category: string;
}

interface CategoryScore {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  obtainedPoints: number;
  percentage: number;
}

@Schema({ timestamps: true })
export class TestResult {
  // MongoDB will automatically add _id as ObjectId
  _id?: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, ref: 'TestConfig', type: Types.ObjectId })
  testConfigId: Types.ObjectId;

  @Prop({ required: true })
  testName: string;

  @Prop({ required: true, type: [Object] })
  answers: Answer[];

  @Prop({ required: true, type: [Object] })
  categoryScores: CategoryScore[];

  @Prop({ required: true })
  totalQuestions: number;

  @Prop({ required: true })
  correctAnswers: number;

  @Prop({ required: true })
  totalPoints: number;

  @Prop({ required: true })
  obtainedPoints: number;

  @Prop({ required: true })
  percentage: number;

  @Prop({ required: true, enum: ['Pass', 'Fail'] })
  status: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  duration: number; // in seconds

  @Prop({ default: false })
  cheatingDetected: boolean;

  @Prop({ default: 0 })
  warningsGiven: number;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResult);
