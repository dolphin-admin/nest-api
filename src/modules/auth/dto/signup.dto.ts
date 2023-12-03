import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class SignupDto {
  @ApiProperty({ description: '用户名' })
  @Length(6, 16, { message: t('user.USERNAME.LENGTH') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  @Matches(/[0-9]/, { message: t('user.PASSWORD.CONTAIN.ONE.DIGITAL.CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: t('user.PASSWORD.CONTAIN.ONE.LETTER') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  readonly password: string

  @ApiPropertyOptional({ description: '名' })
  @IsString({ message: t('user.FIRST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.FIRST.NAME.INVALID') })
  @NotContains(' ', { message: t('user.FIRST.NAME.NO.WHITESPACE') })
  readonly firstName: string

  @ApiPropertyOptional({ description: '姓' })
  @IsString({ message: t('user.LAST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.LAST.NAME.NOT.EMPTY') })
  @NotContains(' ', { message: t('user.LAST.NAME.NO.WHITESPACE') })
  readonly lastName: string
}
