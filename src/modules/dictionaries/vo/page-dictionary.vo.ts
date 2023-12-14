import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { DictionaryVo } from './dictionary.vo'

export class PageDictionaryVo extends PageVo {
  @Type(() => DictionaryVo)
  records: DictionaryVo[]
}
