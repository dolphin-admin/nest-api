import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches, MaxLength, NotContains } from 'class-validator'

import { CreateUserDto } from '@/modules/users/dto'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class SignupDto extends CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsString({ message: t('user.USERNAME.INVALID') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Matches(/[0-9]/, { message: t('user.PASSWORD.CONTAIN.ONE.DIGITAL.CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: t('user.PASSWORD.CONTAIN.ONE.LETTER') })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsString({ message: t('user.PASSWORD.INVALID') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  readonly password: string

  @ApiProperty({ description: '名' })
  @MaxLength(10, { message: t('user.FIRST.NAME.INVALID') })
  @IsString({ message: t('user.FIRST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.FIRST.NAME.INVALID') })
  readonly firstName: string

  @ApiProperty({ description: '姓' })
  @MaxLength(10, { message: t('user.LAST.NAME.INVALID') })
  @IsString({ message: t('user.LAST.NAME.INVALID') })
  @IsNotEmpty({ message: t('user.LAST.NAME.NOT.EMPTY') })
  readonly lastName: string
}
