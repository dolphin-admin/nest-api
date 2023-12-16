import { Type } from 'class-transformer'

import { Page } from '@/class'

import { DictionaryItemVo } from './dictionary-item.vo'

export class PageDictionaryItemVo extends Page {
  @Type(() => DictionaryItemVo)
  records: DictionaryItemVo[]
}
