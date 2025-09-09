import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  // MongoDB will automatically add _id as ObjectId
  _id?: Types.ObjectId;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true, type: [String] })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number; // Index of correct option

  @Prop({ required: true, enum: ['DSA', 'OOP', 'PF'] })
  category: string;

  @Prop({ required: true, default: 1 })
  points: number;

  @Prop({ required: true, enum: ['Easy', 'Medium', 'Hard'] })
  difficulty: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
