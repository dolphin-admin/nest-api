import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

import { MultilingualVo } from '@/class'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class DictionaryVo {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({
    description: '字典编码'
  })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsNotEmpty({ message: t('common.KEY.NOT.EMPTY') })
  code: string

  @ApiProperty({ description: '展示名称', type: MultilingualVo })
  @Type(() => MultilingualVo)
  label: MultilingualVo

  @ApiProperty({ description: '备注', type: MultilingualVo })
  @Type(() => MultilingualVo)
  remark: MultilingualVo

  @ApiProperty({
    description: '是否启用'
  })
  enabled: boolean

  @ApiProperty({
    description: '是否内置'
  })
  builtIn: boolean

  @ApiProperty({
    description: '排序'
  })
  sort: number

  @ApiProperty({ description: '用户 ID' })
  userId: number
}
