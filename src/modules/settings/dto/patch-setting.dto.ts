import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  NotContains,
  ValidateNested
} from 'class-validator'

import { LabelOptionalTransDto, RemarkOptionalTransDto } from '@/class'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class PatchSettingDto {
  @ApiProperty({ description: '键' })
  @MaxLength(50, { message: t('common.KEY.LENGTH') })
  @NotContains(' ', { message: t('common.KEY.NO.WHITESPACE') })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsOptional()
  key?: string

  @ApiProperty({ description: '值' })
  @MaxLength(250, { message: t('common.VALUE.LENGTH') })
  @NotContains(' ', { message: t('common.VALUE.NO.WHITESPACE') })
  @IsString({ message: t('common.VALUE.INVALID') })
  @IsOptional()
  value?: string

  @ApiProperty({ description: '展示名称', type: LabelOptionalTransDto })
  @ValidateNested({ message: t('common.LABEL.TRANS.MISSING') })
  @Type(() => LabelOptionalTransDto)
  @IsOptional()
  label?: LabelOptionalTransDto

  @ApiProperty({ description: '备注', type: RemarkOptionalTransDto })
  @ValidateNested({ message: t('common.REMARK.TRANS.MISSING') })
  @Type(() => RemarkOptionalTransDto)
  @IsOptional()
  remark?: RemarkOptionalTransDto

  @ApiProperty({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsOptional()
  enabled?: boolean

  @ApiProperty({ description: '是否内置' })
  @IsBoolean({ message: t('common.BUILTIN.INVALID') })
  @IsOptional()
  builtIn?: boolean
}
