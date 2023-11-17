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

import { LabelTransDto } from './label-trans.dto'
import { RemarkTransDto } from './remark-trans.dto'

export class CreateUserSettingDto {
  @ApiProperty({ description: '键' })
  @MaxLength(50, { message: '键：长度不能超过 50 个字符' })
  @IsString({ message: '“键：输入值不合法' })
  @IsNotEmpty({ message: '键：不能为空' })
  @NotContains(' ', { message: '键：不能包含空格' })
  key: string

  @ApiProperty({ description: '值' })
  @MaxLength(250, { message: '值：长度不能超过 250 个字符' })
  @IsString({ message: '“值：输入值不合法' })
  @IsNotEmpty({ message: '值：不能为空' })
  @NotContains(' ', { message: '值：不能包含空格' })
  value: string

  @ApiProperty({ description: '展示名称', type: LabelTransDto })
  @ValidateNested({ message: '展示名称：缺失翻译字段' })
  @Type(() => LabelTransDto)
  label: LabelTransDto

  @ApiProperty({ description: '备注', type: RemarkTransDto })
  @ValidateNested({ message: '展示名称：缺失翻译字段' })
  @Type(() => RemarkTransDto)
  remark: RemarkTransDto

  @ApiProperty({ description: '是否启用' })
  @IsBoolean({ message: '是否启用：输入值不合法' })
  @IsNotEmpty({ message: '是否启用：不能为空' })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  @IsBoolean({ message: '是否内置：输入值不合法' })
  @IsNotEmpty({ message: '是否内置：不能为空' })
  builtIn: boolean
}
