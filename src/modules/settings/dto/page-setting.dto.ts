import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsPositive, IsString } from 'class-validator'

import { PageDto } from '@/class'

export class PageSettingDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsPositive({ message: 'ID必须是一个正整数' })
  @IsOptional()
  id?: number

  @ApiPropertyOptional({ description: '键' })
  @IsString({ message: '键必须是一个字符串' })
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: '值' })
  @IsString({ message: '值必须是一个字符串' })
  @IsOptional()
  value?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: '是否启用必须是一个布尔值' })
  @IsOptional()
  enabled?: boolean

  @ApiPropertyOptional({ description: '是否内置' })
  @IsBoolean({ message: '是否内置必须是一个布尔值' })
  @IsOptional()
  builtIn?: boolean
}
