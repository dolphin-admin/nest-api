import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, MaxLength } from 'class-validator'

import type { MultilingualDto } from '@/class'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class LabelTransDto implements MultilingualDto {
  @ApiProperty({ description: '展示名称 - 英文' })
  @MaxLength(50, { message: t('common.LABEL.LENGTH.EN.US') })
  'en-US': string = ''

  @ApiProperty({ description: '展示名称 - 简体中文' })
  @MaxLength(50, { message: t('common.LABEL.LENGTH.ZH.CN') })
  @IsOptional()
  'zh-CN': string = ''
}
