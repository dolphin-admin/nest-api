import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  readonly password: string
}
