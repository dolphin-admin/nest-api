import {
  BadRequestException,
  Inject,
  Injectable,
  NotImplementedException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from '@node-rs/bcrypt'
import { plainToClass } from 'class-transformer'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { JwtConfig } from '@/configs'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { JWTPayload } from '@/interfaces'
import { UsersService } from '@/modules/users/users.service'
import { PrismaService } from '@/shared/prisma/prisma.service'

import { OnlineUsersService } from '../users/online-users.service'
import { UserVo } from '../users/vo'
import type { LoginDto, SignupDto } from './dto'
import { AuthVo, TokenVo } from './vo'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly onlineUsersService: OnlineUsersService,
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  // 注册
  async signup(signupDto: SignupDto) {
    const userVo = await this.usersService.create(signupDto)

    const { id, username } = userVo
    const tokens = this.generateTokens(id, username)

    await this.onlineUsersService.setOnlineUser(id, userVo)

    return new AuthVo({ user: userVo, ...tokens })
  }

  // 登录
  async login(loginDto: LoginDto, type: string) {
    let userVo: UserVo

    switch (type) {
      case LoginType.USERNAME:
        userVo = await this.loginByUsername(loginDto)
        break
      case LoginType.EMAIL:
      default:
        userVo = this.loginByEmail()
    }

    const { id, username } = userVo
    const tokens = this.generateTokens(id, username)

    await this.onlineUsersService.setOnlineUser(id, userVo)

    return new AuthVo({ user: userVo, ...tokens })
  }

  // 用户名登录
  async loginByUsername(loginDto: LoginDto) {
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
  loginByEmail(): UserVo {
    throw new NotImplementedException(
      this.i18nService.t('auth.LOGIN.TYPE.NOT.SUPPORTED', { lang: I18nContext.current()!.lang })
    )
  }

  // 刷新令牌
  async refresh(token: string) {
    let id: number
    try {
      const jwtPayload = await this.jwtService.verifyAsync<JWTPayload>(token)
      id = jwtPayload.sub
    } catch {
      throw new UnauthorizedException(this.i18nService.t('auth.UNAUTHORIZED'))
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })

    if (!user) {
      throw new UnauthorizedException(this.i18nService.t('auth.UNAUTHORIZED'))
    }

    const tokens = this.generateTokens(id, user.username)

    const userVo = plainToClass(UserVo, user)
    await this.onlineUsersService.setOnlineUser(id, userVo)

    return new TokenVo({ ...tokens })
  }

  // 生成 access token
  private generateAccessToken(id: number, username: string): string {
    const payload: JWTPayload = { sub: id, username }
    const { accessTokenExp } = this.jwtConfig
    return this.jwtService.sign(payload, { expiresIn: accessTokenExp })
  }

  // 生成 refresh token
  private generateRefreshToken(id: number, username: string): string {
    const payload: JWTPayload = { sub: id, username }
    const { refreshTokenExp } = this.jwtConfig
    return this.jwtService.sign(payload, { expiresIn: refreshTokenExp })
  }

  // 生成 token
  generateTokens(id: number, username: string) {
    return {
      accessToken: this.generateAccessToken(id, username),
      refreshToken: this.generateRefreshToken(id, username)
    }
  }
}
