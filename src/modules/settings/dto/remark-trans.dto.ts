import { ApiProperty } from '@nestjs/swagger'
import { MaxLength } from 'class-validator'

import type { MultilingualDto } from '@/class'

export class RemarkTransDto implements MultilingualDto {
  @ApiProperty({ description: '备注 - 英文' })
  @MaxLength(50, { message: '备注 - 英文：长度不能超过 500 个字符' })
  'en-US': string

  @ApiProperty({ description: '备注 - 简体中文' })
  @MaxLength(50, { message: '备注 - 简体中文：长度不能超过 500 个字符' })
  'zh-CN': string
}
