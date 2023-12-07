import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  NotContains,
  ValidateNested
} from 'class-validator'

import { LabelTransDto, RemarkTransDto } from '@/class'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class DictionaryDto {
  @ApiProperty({ description: '字典编码' })
  @MaxLength(50, { message: t('common.KEY.LENGTH') })
  @NotContains(' ', { message: t('common.KEY.NO.WHITESPACE') })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsNotEmpty({ message: t('common.KEY.NOT.EMPTY') })
  code: string

  @ApiProperty({ description: '展示名称', type: LabelTransDto })
  @ValidateNested({ message: t('common.LABEL.TRANS.MISSING') })
  @Type(() => LabelTransDto)
  label: LabelTransDto

  @ApiProperty({ description: '备注', type: RemarkTransDto })
  @ValidateNested({ message: t('common.REMARK.TRANS.MISSING') })
  @Type(() => RemarkTransDto)
  remark: RemarkTransDto

  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsNotEmpty({ message: t('common.ENABLED.NOT.EMPTY') })
  @ApiProperty({
    description: '是否启用'
  })
  enabled: boolean

  @IsBoolean({ message: t('common.BUILT.IN.INVALID') })
  @IsNotEmpty({ message: t('common.BUILT.IN.NOT.EMPTY') })
  @ApiProperty({
    description: '是否内置'
  })
  builtIn: boolean

  @ApiProperty({ description: '排序' })
  sort: number
}
