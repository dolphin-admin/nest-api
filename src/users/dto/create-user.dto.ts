import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  readonly password: string
}
