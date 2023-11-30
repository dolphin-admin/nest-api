import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('auth.USERNAME.LENGTH') })
  @IsNotEmpty({ message: t('auth.USERNAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('auth.USERNAME.NO_WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('auth.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: t('auth.PASSWORD.NOT.EMPTY') })
  @NotContains(' ', { message: t('auth.PASSWORD.NO_WHITESPACE') })
  readonly password: string
}
