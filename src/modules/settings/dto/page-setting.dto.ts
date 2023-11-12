import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

import { PageDto } from '@/class'
import { ToId, Trim } from '@/decorators'

export class PageSettingDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber({}, { message: 'ID 必须是一个数字' })
  @IsOptional()
  @ToId()
  id?: number

  @ApiPropertyOptional({ description: '键' })
  @IsString({ message: '键必须是一个字符串' })
  @IsOptional()
  @Trim()
  key?: string

  @ApiPropertyOptional({ description: '值' })
  @IsString({ message: '值必须是一个字符串' })
  @IsOptional()
  @Trim()
  value?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiPropertyOptional({ description: '是否内置' })
  @IsBoolean()
  @IsOptional()
  builtIn?: boolean
}
