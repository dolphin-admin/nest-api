import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, MaxLength } from 'class-validator'

import type { MultilingualDto } from '@/class'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class RemarkOptionalTransDto implements Partial<MultilingualDto> {
  @ApiProperty({ description: '备注 - 英文' })
  @MaxLength(500, { message: t('common.REMARK.LENGTH.EN.US') })
  @IsOptional()
  'en-US'?: string

  @ApiProperty({ description: '备注 - 简体中文' })
  @MaxLength(500, { message: t('common.REMARK.LENGTH.ZH.CN') })
  @IsOptional()
  'zh-CN'?: string
}
