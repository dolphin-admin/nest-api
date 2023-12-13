import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class CreateLocaleDto {
  @ApiProperty({ description: '键' })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsNotEmpty({ message: t('common.KEY.NOT.EMPTY') })
  @NotContains(' ', { message: t('common.KEY.NO.WHITESPACE') })
  key: string

  @ApiProperty({ description: '命名空间' })
  @IsString({ message: t('common.NS.INVALID') })
  @IsNotEmpty({ message: t('common.NS.NOT.EMPTY') })
  @NotContains(' ', { message: t('common.NS.NO.WHITESPACE') })
  ns: string

  @ApiPropertyOptional({ description: '英文' })
  @IsOptional()
  'en-US'?: string

  @ApiPropertyOptional({ description: '简体中文' })
  @IsOptional()
  'zh-CN'?: string
}
