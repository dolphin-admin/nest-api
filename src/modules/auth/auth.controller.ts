import {
  BadRequestException,
  Body,
  Controller,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { SkipAuth } from '@/decorators'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { JWTPayload } from '@/interfaces'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { UserVo } from '../users/vo'
import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './dto'
import { AuthVo, TokenVo } from './vo'

@ApiTags('认证')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  @ApiOperation({ summary: '注册' })
  @SkipThrottle()
  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R<AuthVo>> {
    const user = await this.authService.signup(signupDto)
    const { id, username } = user
    return new R({
      data: new AuthVo({
        user,
        ...this.authService.generateTokens(id, username)
      }),
      msg: i18n.t('auth.SIGN.UP.SUCCESS')
    })
  }

  @ApiOperation({ summary: '登录' })
  @ApiQuery({
    name: 'type',
    description: '登录类型：[1] 用户名，[2] 邮箱',
    required: true,
    type: 'string',
    example: LoginType.USERNAME
  })
  @ApiBody({
    type: LoginDto,
    examples: { admin: { value: { username: 'admin', password: '123456' } } }
  })
  @SkipThrottle()
  @Post('login')
  async login(
    @Query(
      'type',
      new ParseEnumPipe(LoginType, {
        exceptionFactory: () => {
          const i18n = I18nContext.current<I18nTranslations>()!
          throw new NotImplementedException(i18n.t('auth.LOGIN.TYPE.NOT.SUPPORTED'))
        }
      })
    )
    type: string,
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R<AuthVo>> {
    let user: UserVo

    switch (type) {
      case LoginType.USERNAME:
        user = await this.authService.loginByUsername(loginDto)
        break
      case LoginType.EMAIL:
      default:
        throw new BadRequestException(i18n.t('auth.LOGIN.TYPE.NOT.SUPPORTED'))
    }
    const { id, username } = user
    return new R({
      data: new AuthVo({
        user,
        ...this.authService.generateTokens(id, username)
      }),
      msg: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiQuery({ name: 'token', description: '刷新令牌', required: true, type: 'string' })
  @SkipThrottle()
  @Post('refresh')
  async refresh(
    @Query('token') refreshToken: string,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R<TokenVo>> {
    let sub: number
    try {
      const jwtPayload = await this.jwtService.verifyAsync<JWTPayload>(refreshToken)
      sub = jwtPayload.sub
    } catch {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: sub,
        deletedAt: null
      }
    })
    if (!user) {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return new R({
      data: new TokenVo(this.authService.generateTokens(sub, user.username))
    })
  }
}
