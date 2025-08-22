import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
