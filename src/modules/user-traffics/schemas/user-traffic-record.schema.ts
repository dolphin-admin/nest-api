import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type UserTrafficRecordDocument = HydratedDocument<UserTrafficRecord>

@Schema({
  id: true,
  timestamps: true,
  collection: 'user_traffic_records'
})
export class UserTrafficRecord {
  // 路由标题
  @Prop()
  title?: string

  // 路由 Url
  @Prop()
  url?: string

  // 路由路径
  @Prop()
  path?: string

  // 进入时间
  @Prop()
  enterAt?: Date

  // 离开时间
  @Prop()
  leaveAt?: Date

  // 停留时长（毫秒）
  @Prop()
  duration?: number
}

export const UserTrafficRecordSchema = SchemaFactory.createForClass(UserTrafficRecord)
