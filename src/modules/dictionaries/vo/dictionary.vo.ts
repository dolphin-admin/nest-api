import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { BaseResourceVo, MultilingualVo } from '@/class'

export class DictionaryVo extends BaseResourceVo {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '字典编码' })
  code: string

  @ApiProperty({ description: '展示名称', type: MultilingualVo })
  @Type(() => MultilingualVo)
  label: MultilingualVo

  @ApiProperty({ description: '备注', type: MultilingualVo })
  @Type(() => MultilingualVo)
  remark: MultilingualVo

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  builtIn: boolean

  @ApiProperty({ description: '排序' })
  sort: number
}
