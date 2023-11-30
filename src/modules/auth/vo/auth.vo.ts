import { ApiProperty } from '@nestjs/swagger'

import { UserVo } from '@/modules/users/vo'

import { TokenVo } from './token.vo'

export class AuthVo extends TokenVo {
  @ApiProperty({ description: '用户信息', type: UserVo })
  user: UserVo

  constructor(authVo?: Partial<AuthVo>) {
    const { accessToken, refreshToken, user } = authVo ?? {}
    super({ accessToken, refreshToken })
    Object.assign(this, { user })
  }
}
