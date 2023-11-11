import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { BaseResourceVo, MultilingualVo } from '@/class'

export class SettingVo extends BaseResourceVo {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '键' })
  key: string

  @ApiProperty({ description: '值' })
  value: string

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
  sortOrder: number
}
