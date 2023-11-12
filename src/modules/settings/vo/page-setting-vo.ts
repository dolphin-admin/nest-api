import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { SettingVo } from './setting.vo'

export class PageSettingVo extends PageVo {
  @Type(() => SettingVo)
  data?: SettingVo[]
}
