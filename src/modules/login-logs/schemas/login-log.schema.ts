import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type LoginLogDocument = HydratedDocument<LoginLog>

@Schema({
  id: true,
  timestamps: true,
  collection: 'login_logs'
})
export class LoginLog {
  // 用户 ID
  @Prop()
  userId?: number

  // 用户名
  @Prop()
  username?: string

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

  // 浏览器
  @Prop()
  browser?: string

  // 操作系统
  @Prop()
  os?: string

  // 响应状态
  @Prop()
  responseStatus?: string

  // 响应消息
  @Prop()
  responseMessage?: string
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog)
