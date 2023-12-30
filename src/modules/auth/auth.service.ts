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
import type { CustomRequest, JwtPayload } from '@/interfaces'
import { UsersService } from '@/modules/users/users.service'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { SessionService } from '@/shared/session/session.service'
import { UserAgentUtil } from '@/utils'

import { UserVo } from '../users/vo'
import type { LoginDto, SignupDto } from './dto'
import { TokenVo } from './vo'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cacheKeyService: CacheKeyService,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  // 注册
  async signup(signupDto: SignupDto) {
    const userVo = await this.usersService.create(signupDto)

    // 生成 tokens
    const { id, username } = userVo
    const tokens = await this.generateTokens({ sub: id, username })

    return new TokenVo({ ...tokens })
  }

  // 登录
  async login(loginDto: LoginDto, type: string, req: CustomRequest) {
    let userVo: UserVo

    // 处理登录类型
    switch (type) {
      case LoginType.USERNAME:
        userVo = await this.loginByUsername(loginDto)
        break
      case LoginType.EMAIL:
      default:
        userVo = this.loginByEmail()
    }

    // 生成 tokens
    const { id, username } = userVo
    const jwtPayload = { sub: id, username }
    const tokens = await this.generateTokens(jwtPayload)
    const tokenVo = new TokenVo({ ...tokens })

    req.jwtPayload = jwtPayload

    const sid = await this.createSession(tokenVo, req)

    return { tokenVo, sid }
  }

  // 用户名登录
  async loginByUsername(loginDto: LoginDto) {
    // 判断用户名是否存在
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginDto.username,
        enabled: true,
        deletedAt: null
      }
    })
    if (!user) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME.OR.PASSWORD.ERROR', { lang: I18nContext.current()!.lang })
      )
    }

    // 判断密码是否正确
    if (!(await compare(loginDto.password, user.password ?? ''))) {
      throw new BadRequestException(
        this.i18nService.t('auth.USERNAME.OR.PASSWORD.ERROR', { lang: I18nContext.current()!.lang })
      )
    }

    return plainToClass(UserVo, user)
  }

  loginByEmail(): UserVo {
    throw new NotImplementedException(
      this.i18nService.t('auth.LOGIN.TYPE.NOT.SUPPORTED', { lang: I18nContext.current()!.lang })
    )
  }

  // 登出
  async logout(sid: string) {
    if (!sid || !(await this.sessionService.existsSession(sid))) {
      throw new BadRequestException(
        this.i18nService.t('common.OPERATE.FAILED', { lang: I18nContext.current()!.lang })
      )
    }
    // 删除 Redis 中的 Session
    await this.sessionService.deleteSession(sid)
  }

  // 刷新令牌
  async refreshTokens(userId: number, sid: string) {
    const user = await this.usersService.findOneById(userId)
    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.UNAUTHORIZED', { lang: I18nContext.current()!.lang })
      )
    }

    // 生成新的 tokens
    const { id, username } = user
    const { accessToken, refreshToken } = await this.generateTokens({
      sub: id,
      username
    })

    // 刷新 Session 中存储的令牌
    await this.sessionService.refreshSessionTokens(sid, accessToken, refreshToken)

    return new TokenVo({ accessToken, refreshToken })
  }

  // 强制下线
  async forceLogout(sid: string) {
    if (!(await this.sessionService.existsSession(sid))) {
      throw new BadRequestException(
        this.i18nService.t('common.OPERATE.FAILED', { lang: I18nContext.current()!.lang })
      )
    }
    await this.sessionService.deleteSession(sid)
  }

  // 生成令牌
  private async generateTokens(payload: JwtPayload) {
    const { accessTokenSecret, accessTokenExp, refreshTokenSecret, refreshTokenExp } =
      this.jwtConfig

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: accessTokenSecret, expiresIn: accessTokenExp }),
      this.jwtService.signAsync(payload, { secret: refreshTokenSecret, expiresIn: refreshTokenExp })
    ])

    return { accessToken, refreshToken }
  }

  // 创建 Session
  async createSession(tokenVo: TokenVo, request: CustomRequest) {
    const { accessToken, refreshToken } = tokenVo
    const { sub: userId, username } = request.jwtPayload!
    const { ip, headers } = request
    const { userAgent, browser, os } = UserAgentUtil.parseUserAgent(headers['user-agent'])
    const { source } = headers
    const sid = this.sessionService.generateSid()
    await this.sessionService.setSession(sid, {
      sid,
      accessToken,
      refreshToken,
      userId,
      username,
      ip,
      area: '', // TODO: 解析 IP 地址
      source: (source as string) ?? '',
      userAgent,
      browser,
      os,
      loginAt: new Date().toISOString()
    })
    return sid
  }
}
