import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type LocaleDocument = HydratedDocument<Locale>

@Schema({
  id: true,
  timestamps: true,
  autoIndex: true,
  collection: 'locales'
})
export class Locale {
  // 多语言的 key
  @Prop({ required: true })
  key: string

  // 命名空间
  @Prop({ required: true })
  ns: string

  // 英文
  @Prop()
  'en-US': string

  // 简体中文
  @Prop()
  'zh-CN': string
}

export const LocaleSchema = SchemaFactory.createForClass(Locale).index(
  { key: 1, ns: 1 },
  { unique: true }
)
