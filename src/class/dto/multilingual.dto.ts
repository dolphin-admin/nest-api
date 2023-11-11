import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export abstract class MultilingualDto {
  @ApiProperty({ description: '英文' })
  @IsString({ message: '输入值不合法' })
  'en-US': string

  @ApiProperty({ description: '简体中文' })
  @IsString({ message: '输入值不合法' })
  'zh-CN': string
}
