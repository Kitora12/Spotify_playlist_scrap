import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Track {
  @Prop({ required: [true, 'Title is required'], type: String, trim: true })
  titre: string;

  @Prop({ required: [true, 'Artists are required'], type: String, trim: true })
  artists: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  duration: string;
}

export type TrackDocument = Track & Document;
export const TrackSchema = SchemaFactory.createForClass(Track);
