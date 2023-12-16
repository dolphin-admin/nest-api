import { Type } from 'class-transformer'

import { Page } from '@/class'

import { UserSettingVo } from './user-setting.vo'

export class PageUserSettingVo extends Page {
  @Type(() => UserSettingVo)
  records: UserSettingVo[]
}
