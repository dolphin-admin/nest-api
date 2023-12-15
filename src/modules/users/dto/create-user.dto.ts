import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @MaxLength(50, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  username: string

  @ApiProperty({ description: '密码' })
  @MaxLength(50, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  password: string
}
