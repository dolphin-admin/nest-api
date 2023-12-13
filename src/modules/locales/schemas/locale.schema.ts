import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type LocaleDocument = HydratedDocument<Locale>

@Schema({
  id: true,
  timestamps: true
})
export class Locale {
  @Prop({ required: true, unique: true })
  key: string

  @Prop({ required: true })
  ns: string

  @Prop({ default: 0 })
  sort: number

  @Prop()
  'en-US': string

  @Prop()
  'zh-CN': string
}

export const LocaleSchema = SchemaFactory.createForClass(Locale)
