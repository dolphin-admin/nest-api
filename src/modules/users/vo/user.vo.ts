import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { BaseResourceVo } from '@/class'

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
  phoneNumber: string

  @ApiProperty({ description: '昵称' })
  nickName: string

  @ApiProperty({ description: '名' })
  firstName: string

  @ApiProperty({ description: '中间名' })
  middleName: string

  @ApiProperty({ description: '姓' })
  lastName: string

  @ApiProperty({ description: '全名', type: () => String })
  @Expose({ name: 'fullName' })
  getFullName(): string {
    return [this.firstName, this.middleName ?? '', this.lastName].filter((item) => item).join(' ')
  }

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

  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @ApiProperty({ description: '是否内置' })
  builtIn: boolean
}
