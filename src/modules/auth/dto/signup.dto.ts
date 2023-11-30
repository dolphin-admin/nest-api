import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class SignupDto {
  @ApiProperty({ description: '用户名' })
  @Length(6, 16, { message: t('auth.USERNAME.LENGTH') })
  @IsNotEmpty({ message: t('auth.USERNAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('auth.USERNAME.NO_WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('auth.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: t('auth.PASSWORD.NOT.EMPTY') })
  @Matches(/[0-9]/, { message: t('auth.PASSWORD.CONTAIN.ONE.DIGITAL.CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: t('auth.PASSWORD.CONTAIN.ONE.LETTER') })
  @NotContains(' ', { message: t('auth.PASSWORD.NO_WHITESPACE') })
  readonly password: string

  @ApiPropertyOptional({ description: '名' })
  @IsString({ message: t('user.FIRST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.FIRST.NAME.INVALID') })
  @NotContains(' ', { message: t('user.FIRST.NAME.NO_WHITESPACE') })
  readonly firstName: string

  @ApiPropertyOptional({ description: '姓' })
  @IsString({ message: t('user.LAST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.LAST.NAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('user.LAST.NAME.NO_WHITESPACE') })
  readonly lastName: string
}
