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

export class CreateUserSettingDto {
  @ApiProperty({ description: '键' })
  @MaxLength(50, { message: t('common.KEY.LENGTH') })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsNotEmpty({ message: t('common.KEY.NOT.EMPTY') })
  @NotContains(' ', { message: t('common.KEY.NO.WHITESPACE') })
  key: string

  @ApiProperty({ description: '值' })
  @MaxLength(250, { message: t('common.VALUE.LENGTH') })
  @IsString({ message: t('common.VALUE.INVALID') })
  @IsNotEmpty({ message: t('common.VALUE.NOT.EMPTY') })
  @NotContains(' ', { message: t('common.VALUE.NO.WHITESPACE') })
  value: string

  @ApiProperty({ description: '展示名称', type: LabelTransDto })
  @ValidateNested({ message: t('common.LABEL.TRANS.MISSING') })
  @Type(() => LabelTransDto)
  label: LabelTransDto

  @ApiProperty({ description: '备注', type: RemarkTransDto })
  @ValidateNested({ message: t('common.REMARK.TRANS.MISSING') })
  @Type(() => RemarkTransDto)
  remark: RemarkTransDto

  @ApiProperty({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsNotEmpty({ message: t('common.ENABLED.NOT.EMPTY') })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  @IsBoolean({ message: t('common.BUILTIN.INVALID') })
  @IsNotEmpty({ message: t('common.BUILTIN.NOT.EMPTY') })
  builtIn: boolean
}
