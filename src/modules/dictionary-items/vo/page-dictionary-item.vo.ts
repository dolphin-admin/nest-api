import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { DictionaryItemVo } from './dictionary-item.vo'

export class PageDictionaryItemVo extends PageVo {
  @Type(() => DictionaryItemVo)
  records: DictionaryItemVo[]
}
