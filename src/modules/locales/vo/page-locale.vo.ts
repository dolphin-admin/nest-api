import { Type } from 'class-transformer'

import { Page } from '@/class'

import { LocaleVo } from './locale.vo'

export class PageLocaleVo extends Page<LocaleVo> {
  @Type(() => LocaleVo)
  records: LocaleVo[]
}
