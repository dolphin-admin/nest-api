import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type LoginLogDocument = HydratedDocument<LoginLog>

@Schema({
  id: true,
  timestamps: true
})
export class LoginLog {
  // 认证类型
  @Prop()
  authType?: string

  // IP
  @Prop()
  ip?: string

  // 地区
  @Prop()
  area?: string

  // 访问来源
  @Prop()
  source?: string

  // 用户代理
  @Prop()
  userAgent?: string
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog)
