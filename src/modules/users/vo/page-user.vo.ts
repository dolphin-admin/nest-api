import { Type } from 'class-transformer'

import { Page } from '@/class'

import { UserVo } from './user.vo'

export class PageUserVo extends Page {
  @Type(() => UserVo)
  records: UserVo[]
}
