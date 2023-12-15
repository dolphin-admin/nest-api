import { Type } from 'class-transformer'

import { PageVo } from '@/class'

import { UserVo } from './user.vo'

export class PageUserVo extends PageVo {
  @Type(() => UserVo)
  records: UserVo[]
}
