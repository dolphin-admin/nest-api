import { ApiProperty } from '@nestjs/swagger'

export class TokenVo {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string

  constructor(tokenVo?: Partial<TokenVo>) {
    Object.assign(this, tokenVo)
  }
}
