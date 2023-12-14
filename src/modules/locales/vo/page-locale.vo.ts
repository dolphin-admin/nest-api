import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { LocaleVo } from './locale.vo'

export class PageLocaleVo extends PageVo<LocaleVo> {
  @Type(() => LocaleVo)
  records: LocaleVo[]
}
