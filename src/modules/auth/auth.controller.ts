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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import type { User as UserQueryResult } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo } from '@/class'
import { SkipAuth } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { JWTPayload } from '@/interfaces'
import { UserVo } from '@/modules/users/vo'

import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { LoginType } from './enum'
import { AuthVo, TokenVo } from './vo'

@ApiTags('认证')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({ summary: '注册' })
  @SkipThrottle()
  @Post('signup')
  async signup() {
    const user = await this.authService.signup()

    return new BaseResponseVo({
      data: new AuthVo({
        user: plainToClass(UserVo, user),
        accessToken: '',
        refreshToken: ''
      }),
      message: '注册成功'
    })
  }

  @ApiOperation({ summary: '登录' })
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
    type: number,
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    let user: UserQueryResult

    switch (type) {
      // 用户名登录
      case LoginType.USERNAME:
        user = await this.authService.loginByUsername(loginDto)
        break
      // 邮箱登录
      case LoginType.EMAIL:
        return this.authService.loginByEmail()
      default:
        return new BadRequestException(i18n.t('auth.LOGIN.TYPE.NOT.SUPPORTED'))
    }

    const { id, username } = user

    return new BaseResponseVo({
      data: new AuthVo({
        user: plainToClass(UserVo, user),
        accessToken: this.authService.generateToken(id, username),
        refreshToken: this.authService.generateRefreshToken(id, username)
      }),
      message: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '刷新令牌' })
  @SkipThrottle()
  @Post('refresh')
  async refresh(@Query('token') refreshToken: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    let sub: number
    try {
      const jwtPayload = await this.jwtService.verifyAsync<JWTPayload>(refreshToken)
      sub = jwtPayload.sub
    } catch {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    const user = await this.usersService.findOneById(sub)
    if (!user) {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return new BaseResponseVo({
      data: new TokenVo({
        accessToken: this.authService.generateToken(sub, user.username),
        refreshToken: this.authService.generateRefreshToken(sub, user.username)
      })
    })
  }
}
