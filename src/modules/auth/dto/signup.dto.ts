import { Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, Matches, MaxLength, NotContains, ValidateIf } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

@Injectable()
export class SignupDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @Matches(/[0-9]/, { message: t('user.PASSWORD.CONTAIN.ONE.DIGITAL.CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: t('user.PASSWORD.CONTAIN.ONE.LETTER') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  readonly password: string

  @ApiProperty({ description: '确认密码' })
  @ValidateIf((o) => o.password === o.confirmPassword, {
    message: t('user.CONFIRM.PASSWORD.NOT.SAME')
  })
  @IsNotEmpty({ message: t('user.CONFIRM.PASSWORD.NOT.EMPTY') })
  readonly confirmPassword: string

  @ApiProperty({ description: '名' })
  @MaxLength(10, { message: t('user.FIRST.NAME.INVALID') })
  @NotContains(' ', { message: t('user.FIRST.NAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.FIRST.NAME.INVALID') })
  readonly firstName: string

  @ApiProperty({ description: '姓' })
  @MaxLength(10, { message: t('user.LAST.NAME.INVALID') })
  @NotContains(' ', { message: t('user.LAST.NAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.LAST.NAME.NOT.EMPTY') })
  readonly lastName: string
}
