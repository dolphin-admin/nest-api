import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { UserSettingVo } from './user-setting.vo'

export class PageUserSettingVo extends PageVo {
  @Type(() => UserSettingVo)
  records: UserSettingVo[]
}
