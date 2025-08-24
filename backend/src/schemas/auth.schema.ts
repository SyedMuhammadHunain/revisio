import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: false })
export class Auth {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
