import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestConfigDocument = TestConfig & Document;

@Schema({ timestamps: true })
export class TestConfig {
  // MongoDB will automatically add _id as ObjectId
  _id?: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  testName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, min: 5 })
  numOfQuestions: number;

  @Prop({ required: true, type: [String] })
  categories: string[];

  @Prop({ required: true, default: 3600 }) // 1 hour in seconds
  duration: number;

  @Prop({ required: true, default: 60 }) // 60% passing score
  passingScore: number;

  @Prop({
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
  })
  status: string;
}

export const TestConfigSchema = SchemaFactory.createForClass(TestConfig);
