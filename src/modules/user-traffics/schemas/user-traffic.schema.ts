import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type HydratedDocument, Types } from 'mongoose'

import type { UserTrafficRecord } from './user-traffic-record.schema'

export type UserTrafficDocument = HydratedDocument<UserTraffic>

@Schema({
  id: true,
  timestamps: true,
  collection: 'user_traffics'
})
export class UserTraffic {
  // 应用名称
  @Prop()
  app?: string

  // 应用版本
  @Prop()
  version?: string

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

  // 经度
  @Prop()
  longitude?: number

  // 纬度
  @Prop()
  latitude?: number

  // 海拔
  @Prop()
  altitude?: number

  // 进入页面时间
  @Prop()
  enterAt?: Date

  // 离开页面时间
  @Prop()
  leaveAt?: Date

  // 页面停留时长（毫秒）
  @Prop()
  duration?: number

  // 页面访问记录
  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserTrafficRecord' }] })
  pageViews?: UserTrafficRecord[]
}

export const UserTrafficSchema = SchemaFactory.createForClass(UserTraffic)
