import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsString({ message: t('user.USERNAME.INVALID') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsString({ message: t('user.PASSWORD.INVALID') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  password: string
}
