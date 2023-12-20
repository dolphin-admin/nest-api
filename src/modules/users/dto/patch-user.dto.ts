import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsOptional, IsString, Length, Matches, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

import { UpdateUserDto } from './update-user.dto'

const { t } = I18nUtils

export class PatchUserDto extends OmitType(UpdateUserDto, ['username'] as const) {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString({ message: t('user.USERNAME.INVALID') })
  @IsOptional()
  username?: string

  @ApiPropertyOptional({ description: '密码' })
  @Matches(/[0-9]/, { message: t('user.PASSWORD.CONTAIN.ONE.DIGITAL.CHARACTER') })
  @Matches(/[a-zA-Z]/, { message: t('user.PASSWORD.CONTAIN.ONE.LETTER') })
  @Length(6, 16, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NO.WHITESPACE') })
  @IsString({ message: t('user.PASSWORD.INVALID') })
  @IsOptional()
  password?: string
}
