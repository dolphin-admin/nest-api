import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { DictionarySelectItemVo } from './dictionary-select-item.vo'

export class ListDictionarySelectItemVo {
  @Type(() => DictionarySelectItemVo)
  @ApiProperty({ type: [DictionarySelectItemVo], description: '字典项列表' })
  records: DictionarySelectItemVo[]

  @ApiProperty({ description: '字典编码' })
  code: string
}
