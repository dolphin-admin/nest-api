import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { BaseResource } from '@/class'

export class DictionaryItemVo extends BaseResource {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '值' })
  value: string

  @ApiProperty({ description: '名称' })
  label: string

  @ApiPropertyOptional({ description: '备注', nullable: true })
  remark?: string

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiPropertyOptional({ description: '排序', nullable: true })
  sort?: number

  @ApiProperty({ description: '字典编码' })
  code: string
}
