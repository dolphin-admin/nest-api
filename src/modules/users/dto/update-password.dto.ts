import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class UpdatePasswordDto {
  @ApiProperty({ description: '密码' })
  @MaxLength(50, { message: t('user.PASSWORD.LENGTH') })
  @NotContains(' ', { message: t('user.PASSWORD.NOT.EMPTY') })
  @IsNotEmpty({ message: t('user.PASSWORD.NOT.EMPTY') })
  password: string
}
