import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { BaseResource } from '@/class'

export class DictionaryVo extends BaseResource {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '字典编码' })
  code: string

  @ApiProperty({ description: '名称' })
  label: string

  @ApiPropertyOptional({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiPropertyOptional({ description: '排序' })
  sort?: number
}
