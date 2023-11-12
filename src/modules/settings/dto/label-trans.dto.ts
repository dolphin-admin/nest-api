import { ApiProperty } from '@nestjs/swagger'
import { MaxLength } from 'class-validator'

import type { MultilingualDto } from '@/class'

export class LabelTransDto implements MultilingualDto {
  @ApiProperty({ description: '展示名称 - 英文' })
  @MaxLength(50, { message: '展示名称 - 英文：长度不能超过 50 个字符' })
  'en-US': string

  @ApiProperty({ description: '展示名称 - 简体中文' })
  @MaxLength(50, { message: '展示名称 - 简体中文：长度不能超过 50 个字符' })
  'zh-CN': string
}
