import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

import { BaseResourceVo } from '@/common'

export class UserVo extends BaseResourceVo {
  @ApiProperty({ description: '用户 ID' })
  id: number

  @ApiProperty({ description: '用户名' })
  username: string

  // 密码
  @ApiHideProperty()
  @Exclude()
  password: string

  @ApiProperty({ description: '邮箱' })
  email: string

  @ApiProperty({ description: '手机号' })
  phone: string

  @ApiProperty({ description: '姓名' })
  name: string

  @ApiProperty({ description: '昵称' })
  nickname: string

  @ApiProperty({ description: '名' })
  firstName: string

  @ApiProperty({ description: '中间名' })
  middleName: string

  @ApiProperty({ description: '姓' })
  lastName: string

  @ApiProperty({ description: '头像' })
  avatar: string

  @ApiProperty({ description: '性别' })
  gender: string

  @ApiProperty({ description: '国家' })
  country: string

  @ApiProperty({ description: '省份' })
  province: string

  @ApiProperty({ description: '城市' })
  city: string

  @ApiProperty({ description: '地址' })
  address: string

  @ApiProperty({ description: '个人简介' })
  biography: string

  @ApiProperty({ description: '个人网站' })
  website: string

  @ApiProperty({ description: '个人主页' })
  profile: string

  @ApiProperty({ description: '出生日期' })
  birthDate: Date

  @ApiProperty({ description: '邮箱是否验证' })
  emailVerified: boolean

  @ApiProperty({ description: '手机号是否验证' })
  phoneNumberVerified: boolean

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  builtIn: boolean

  @ApiProperty({ description: '认证 ID' })
  authId: number
}
