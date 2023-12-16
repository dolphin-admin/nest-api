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

export class CreateDictionaryItemDto {
  @ApiProperty({ description: '值' })
  @MaxLength(250, { message: t('common.VALUE.LENGTH') })
  @IsString({ message: t('common.VALUE.INVALID') })
  @NotContains(' ', { message: t('common.VALUE.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('common.VALUE.NOT.EMPTY') })
  value: string

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

  @ApiProperty({ description: '字典 ID' })
  @IsNumber({}, { message: t('dictionary.ID.INVALID') })
  @IsNotEmpty({ message: t('dictionary.ID.NOT.EMPTY') })
  dictionaryId: number
}
