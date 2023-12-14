import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type LocaleDocument = HydratedDocument<Locale>

@Schema({
  id: true,
  timestamps: true,
  autoIndex: true
})
export class Locale {
  @Prop({ required: true })
  key: string

  @Prop({ required: true })
  ns: string

  @Prop({ default: 0 })
  sort?: number

  @Prop()
  'en-US': string

  @Prop()
  'zh-CN': string
}

export const LocaleSchema = SchemaFactory.createForClass(Locale).index(
  { key: 1, ns: 1 },
  { unique: true }
)
