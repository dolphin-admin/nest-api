import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, NotContains } from 'class-validator'

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: 'auth.USERNAME.LENGTH' })
  @IsNotEmpty({ message: 'auth.USERNAME.NOT_EMPTY' })
  @NotContains(' ', { message: 'auth.USERNAME.NO_WHITESPACE' })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 16, { message: 'auth.PASSWORD.LENGTH' })
  @IsNotEmpty({ message: 'auth.PASSWORD.NOT_EMPTY' })
  @NotContains(' ', { message: 'auth.PASSWORD.NO_WHITESPACE' })
  readonly password: string
}
