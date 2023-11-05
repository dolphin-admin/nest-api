import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches, NotContains } from 'class-validator'

import { i18nMessage } from '@/utils'

export class SignupDto {
  @ApiProperty({ description: '用户名' })
  @Length(6, 16, { message: i18nMessage('auth.USERNAME.LENGTH') })
  @IsNotEmpty({ message: i18nMessage('auth.USERNAME.NOT_EMPTY') })
  @NotContains(' ', { message: i18nMessage('auth.USERNAME.NO_WHITESPACE') })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: i18nMessage('auth.PASSWORD.LENGTH') })
  @IsNotEmpty({ message: i18nMessage('auth.PASSWORD.NOT_EMPTY') })
  @Matches(/[0-9]/, { message: i18nMessage('auth.PASSWORD.CONTAIN_ONE_DIGITAL_CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: i18nMessage('auth.PASSWORD.CONTAIN_ONE_LETTER') })
  @NotContains(' ', { message: i18nMessage('auth.PASSWORD.NO_WHITESPACE') })
  readonly password: string

  @ApiPropertyOptional({ description: '名' })
  @IsString({ message: i18nMessage('user.FIRST_NAME.INVALID') })
  @IsNotEmpty({ message: i18nMessage('user.FIRST_NAME.INVALID') })
  @NotContains(' ', { message: i18nMessage('user.FIRST_NAME.NO_WHITESPACE') })
  readonly firstName: string

  @ApiPropertyOptional({ description: '姓' })
  @IsString({ message: i18nMessage('user.LAST_NAME.INVALID') })
  @IsNotEmpty({ message: i18nMessage('user.LAST_NAME.NOT_EMPTY') })
  @NotContains(' ', { message: i18nMessage('user.LAST_NAME.NO_WHITESPACE') })
  readonly lastName: string
}
