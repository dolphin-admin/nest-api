import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from '@node-rs/bcrypt'
import type { User } from '@prisma/client'
import { I18nService } from 'nestjs-i18n'

import type { JWTPayload } from '@/common'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'

import type { LoginDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  // 生成 token
  generateToken(user: User): string {
    const { id, username } = user
    const payload: JWTPayload = { sub: id, username }
    return this.jwtService.sign(payload)
  }

  // 注册
  signup() {
    return this.prismaService
      .$queryRaw`SELECT * FROM "system_user" Where id = 2`
  }

  // 用户名登录
  async loginByUsername(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findOneByUsername(loginDto.username)
    if (!user) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME.NOT_EXIST')
      )
    }

    if (!(await compare(loginDto.password, user.password ?? ''))) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME_OR_PASSWORD_ERROR')
      )
    }

    return user
  }

  // 邮箱登录
  loginByEmail(loginDto: LoginDto) {
    console.log(loginDto)
    throw new BadRequestException('不支持该登录方式: email')
  }
}
