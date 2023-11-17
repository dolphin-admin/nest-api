import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import type { User } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo } from '@/class'
import { Auth, SkipAuth } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { UserVo } from '@/modules/users/vo'

import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { LoginType } from './enum'
import { AuthVo } from './vo'

@ApiTags('认证')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '注册' })
  @SkipThrottle()
  @Post('signup')
  signup() {
    const user = this.authService.signup()

    return new BaseResponseVo({
      data: new AuthVo({
        user: plainToClass(UserVo, user),
        accessToken: ''
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
          throw new NotImplementedException(i18n.t('auth.LOGIN.TYPE_NOT_SUPPORTED'))
        }
      })
    )
    type: number,
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    let user: User

    switch (type) {
      // 用户名登录
      case LoginType.USERNAME:
        user = await this.authService.loginByUsername(loginDto)
        break
      // 邮箱登录
      case LoginType.EMAIL:
        return this.authService.loginByEmail()
      default:
        return new BadRequestException(i18n.t('auth.LOGIN.TYPE_NOT_SUPPORTED'))
    }

    return new BaseResponseVo({
      data: new AuthVo({
        user: plainToClass(UserVo, user),
        accessToken: this.authService.generateToken(user)
      }),
      message: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '退出登录' })
  @Auth()
  @Get('logout')
  logout() {
    return new BaseResponseVo({
      message: '退出成功'
    })
  }
}
