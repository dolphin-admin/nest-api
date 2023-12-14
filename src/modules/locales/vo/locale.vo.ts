import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { MongoBaseVo } from '@/class'

@Exclude()
export class LocaleVo extends MongoBaseVo {
  @ApiProperty({ description: '键' })
  @Expose()
  key: string

  @ApiProperty({ description: '命名空间' })
  @Expose()
  ns: string

  @ApiPropertyOptional({ description: '排序' })
  @Expose()
  sort?: number

  @ApiProperty({ description: '英文' })
  @Expose()
  'en-US': string

  @ApiProperty({ description: '简体中文' })
  @Expose()
  'zh-CN': string
}
