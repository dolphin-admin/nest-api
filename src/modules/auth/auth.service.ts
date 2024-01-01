import { BadRequestException, Inject, Injectable, NotImplementedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from '@node-rs/bcrypt'
import { plainToClass } from 'class-transformer'
import ms from 'ms'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { JwtConfig } from '@/configs'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { CustomRequest, JwtPayload } from '@/interfaces'
import { UsersService } from '@/modules/users/users.service'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'
import { GeneratorUtils, UserAgentUtil } from '@/utils'

import { UserVo } from '../users/vo'
import type { LoginDto, SignupDto } from './dto'
import { TokenVo } from './vo'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService,
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  async signup(signupDto: SignupDto, req: CustomRequest) {
    const userVo = await this.usersService.create(signupDto)

    const jwtPayload: JwtPayload = { sub: userVo.id, jti: GeneratorUtils.generateUuid() }
    const tokens = await this.generateTokens(jwtPayload)
    const tokenVo = new TokenVo({ ...tokens })

    req.jwtPayload = jwtPayload

    await this.setJwtMetadata(tokenVo, req)

    return tokenVo
  }

  async login(loginDto: LoginDto, type: string, req: CustomRequest) {
    let userVo: UserVo

    switch (type) {
      case LoginType.USERNAME:
        userVo = await this.loginByUsername(loginDto)
        break
      case LoginType.EMAIL:
      default:
        userVo = this.loginByEmail()
    }

    const { id } = userVo
    const jwtPayload: JwtPayload = { sub: id, jti: GeneratorUtils.generateUuid() }
    const tokens = await this.generateTokens(jwtPayload)
    const tokenVo = new TokenVo({ ...tokens })

    req.jwtPayload = jwtPayload

    await this.setJwtMetadata(tokenVo, req)

    return tokenVo
  }

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

    const userVo = plainToClass(UserVo, user)

    await this.usersService.setUserCache(userVo)

    return userVo
  }

  loginByEmail(): UserVo {
    throw new NotImplementedException(
      this.i18nService.t('auth.LOGIN.TYPE.NOT.SUPPORTED', { lang: I18nContext.current()!.lang })
    )
  }

  async logout(jti: string) {
    const cacheKey = this.cacheKeyService.getJwtMetadataCacheKey(jti)
    if (!(await this.redisService.exists(cacheKey))) {
      throw new BadRequestException(
        this.i18nService.t('common.OPERATE.FAILED', { lang: I18nContext.current()!.lang })
      )
    }
    await this.redisService.del(cacheKey)
  }

  async refreshTokens(jwtPayload: JwtPayload) {
    const { sub, jti } = jwtPayload
    const user = await this.usersService.findOneById(sub)

    const { accessToken, refreshToken } = await this.generateTokens({
      sub: user.id,
      jti
    })

    const cacheKey = this.cacheKeyService.getJwtMetadataCacheKey(jti)
    await this.redisService.hSet(cacheKey, 'accessToken', accessToken)
    await this.redisService.hSet(cacheKey, 'refreshToken', refreshToken)
    await this.redisService.expire(cacheKey, ms(this.jwtConfig.refreshTokenExp) / 1000)

    return new TokenVo({ accessToken, refreshToken })
  }

  private async generateTokens(payload: JwtPayload) {
    const { accessTokenSecret, accessTokenExp, refreshTokenSecret, refreshTokenExp } =
      this.jwtConfig

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: accessTokenSecret, expiresIn: accessTokenExp }),
      this.jwtService.signAsync(payload, { secret: refreshTokenSecret, expiresIn: refreshTokenExp })
    ])

    return { accessToken, refreshToken }
  }

  async setJwtMetadata(tokenVo: TokenVo, request: CustomRequest) {
    const { accessToken, refreshToken } = tokenVo
    const { sub: userId, jti } = request.jwtPayload!
    const { ip, headers } = request
    const { userAgent, browser, os } = UserAgentUtil.parseUserAgent(headers['user-agent'])
    const { source } = headers

    const cacheKey = this.cacheKeyService.getJwtMetadataCacheKey(jti)
    await this.redisService.del(cacheKey)
    await this.redisService.hSetObj(
      cacheKey,
      {
        jti,
        userId,
        accessToken,
        refreshToken,
        ip,
        area: '', // TODO: 解析 IP 地址
        source: (source as string) ?? '',
        userAgent,
        browser,
        os,
        loginAt: new Date().toISOString()
      },
      ms(this.jwtConfig.refreshTokenExp) / 1000
    )
  }
}
