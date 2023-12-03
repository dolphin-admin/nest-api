import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  readonly password: string
}
