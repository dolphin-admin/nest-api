import { ApiProperty } from '@nestjs/swagger'

export class MultilingualVo {
  @ApiProperty({ description: '英文' })
  'en-US': string

  @ApiProperty({ description: '简体中文' })
  'zh-CN': string
}
