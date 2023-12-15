import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  NotContains
} from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class CreateDictionaryDto {
  @ApiProperty({ description: '字典编码' })
  @MaxLength(50, { message: t('dictionary.CODE.LENGTH') })
  @NotContains(' ', { message: t('dictionary.CODE.NO.WHITESPACE') })
  @IsString({ message: t('dictionary.CODE.INVALID') })
  @IsNotEmpty({ message: t('dictionary.CODE.NOT.EMPTY') })
  code: string

  @ApiProperty({ description: '名称' })
  @MaxLength(50, { message: t('common.LABEL.LENGTH') })
  @IsString({ message: t('common.LABEL.INVALID') })
  @IsNotEmpty({ message: t('common.LABEL.NOT.EMPTY') })
  label: string

  @ApiPropertyOptional({ description: '备注' })
  @MaxLength(500, { message: t('common.REMARK.LENGTH') })
  @IsString({ message: t('common.REMARK.INVALID') })
  @IsOptional()
  remark?: string

  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsNotEmpty({ message: t('common.ENABLED.NOT.EMPTY') })
  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiPropertyOptional({ description: '排序' })
  @IsNumber({}, { message: t('common.SORT.INVALID') })
  @IsOptional()
  sort?: number
}
