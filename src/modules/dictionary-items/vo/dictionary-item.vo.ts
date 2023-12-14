import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { BaseResourceVo } from '@/class'

export class DictionaryItemVo extends BaseResourceVo {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '值' })
  value: string

  @ApiProperty({ description: '名称' })
  label: string

  @ApiPropertyOptional({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  builtIn: boolean

  @ApiPropertyOptional({ description: '排序' })
  sort?: number

  @ApiProperty({ description: '字典编码' })
  code: string
}
