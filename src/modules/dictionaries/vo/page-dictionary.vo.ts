import { Type } from 'class-transformer'

import { Page } from '@/class'

import { DictionaryVo } from './dictionary.vo'

export class PageDictionaryVo extends Page {
  @Type(() => DictionaryVo)
  records?: DictionaryVo[]
}
