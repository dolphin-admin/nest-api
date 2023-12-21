import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { MongoBaseResource } from '@/class'

@Exclude()
export class LocaleVo extends MongoBaseResource {
  @ApiProperty({ description: '键' })
  @Expose()
  key: string

  @ApiProperty({ description: '命名空间' })
  @Expose()
  ns: string

  @ApiProperty({ description: '英文' })
  @Expose()
  'en-US': string

  @ApiProperty({ description: '简体中文' })
  @Expose()
  'zh-CN': string
}
