import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: false })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
