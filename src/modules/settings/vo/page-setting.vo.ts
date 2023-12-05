import { Type } from 'class-transformer'

import { Page } from '@/class'

import { SettingVo } from './setting.vo'

export class PageSettingVo extends Page<SettingVo> {
  @Type(() => SettingVo)
  records?: SettingVo[]
}
