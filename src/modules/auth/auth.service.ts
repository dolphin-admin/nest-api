import { BadRequestException, Inject, Injectable, NotImplementedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from '@node-rs/bcrypt'
import { plainToClass } from 'class-transformer'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { JwtConfig } from '@/configs'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { JWTPayload } from '@/interfaces'
import { UsersService } from '@/modules/users/users.service'
import { PrismaService } from '@/shared/prisma/prisma.service'

import { UserVo } from '../users/vo'
import type { LoginDto, SignupDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  // 生成 access token
  generateToken(id: number, username: string): string {
    const payload: JWTPayload = { sub: id, username }
    const { accessTokenExp } = this.jwtConfig
    return this.jwtService.sign(payload, {
      expiresIn: accessTokenExp
    })
  }

  // 生成 refresh token
  generateRefreshToken(id: number, username: string): string {
    const payload: JWTPayload = { sub: id, username }
    const { refreshTokenExp } = this.jwtConfig
    return this.jwtService.sign(payload, {
      expiresIn: refreshTokenExp
    })
  }

  // 注册
  async signup(signupDto: SignupDto): Promise<UserVo> {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { confirmPassword, ...createDto } = signupDto
    const user = await this.usersService.create(createDto)
    return user
  }

  // 用户名登录
  async loginByUsername(loginDto: LoginDto): Promise<UserVo> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginDto.username,
        deletedAt: null
      }
    })
    if (!user) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME.OR.PASSWORD.ERROR', { lang: I18nContext.current()!.lang })
      )
    }
    if (!(await compare(loginDto.password, user.password ?? ''))) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME.OR.PASSWORD.ERROR', { lang: I18nContext.current()!.lang })
      )
    }
    return plainToClass(UserVo, user)
  }

  // 邮箱登录
  loginByEmail() {
    throw new NotImplementedException(
      this.i18nService.t('auth.LOGIN.TYPE.NOT.SUPPORTED', { lang: I18nContext.current()!.lang })
    )
  }
}
