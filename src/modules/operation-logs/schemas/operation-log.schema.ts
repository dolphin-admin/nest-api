import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type OperationLogDocument = HydratedDocument<OperationLog>

@Schema({
  id: true,
  timestamps: true,
  autoIndex: true
})
export class OperationLog {
  // 模块名称
  @Prop()
  moduleName?: string

  // 操作类型
  @Prop()
  type?: string

  // 方法名称
  @Prop()
  method?: string

  // 请求方法
  @Prop()
  requestMethod?: string

  // 请求路径
  @Prop()
  requestUrl?: string

  // 请求查询参数
  @Prop()
  requestQuery?: string

  // 请求路径参数
  @Prop()
  requestParams?: string

  // 请求正文
  @Prop()
  requestBody?: string

  // 响应正文
  @Prop()
  responseBody?: string

  // 响应状态码
  @Prop()
  responseStatusCode?: number

  // 响应业务代码
  @Prop()
  responseBusinessCode?: number

  // 响应消息
  @Prop()
  responseMessage?: string

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

export const OperationLogSchema = SchemaFactory.createForClass(OperationLog)
