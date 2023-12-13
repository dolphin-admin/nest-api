import { ApiProperty } from '@nestjs/swagger'

export class LocaleResourceVO {
  @ApiProperty({ description: '命名空间' })
  ns: string

  @ApiProperty({ description: '多语言资源' })
  resources: Record<string, string>
}
