import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, NotContains } from 'class-validator'

import { i18nMessage } from '@/utils'

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: i18nMessage('auth.USERNAME.LENGTH') })
  @IsNotEmpty({ message: i18nMessage('auth.USERNAME.NOT_EMPTY') })
  @NotContains(' ', { message: i18nMessage('auth.USERNAME.NO_WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: i18nMessage('auth.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: i18nMessage('auth.PASSWORD.NOT_EMPTY') })
  @NotContains(' ', { message: i18nMessage('auth.PASSWORD.NO_WHITESPACE') })
  readonly password: string
}
