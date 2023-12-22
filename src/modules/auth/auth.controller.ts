import {
  Body,
  Controller,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { SkipAuth } from '@/decorators'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './dto'

@ApiTags('认证')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '注册' })
  @SkipThrottle()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @I18n() i18n: I18nContext<I18nTranslations>) {
    return new R({
      data: await this.authService.signup(signupDto),
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
  ) {
    return new R({
      data: await this.authService.login(loginDto, type),
      msg: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiQuery({ name: 'token', description: '刷新令牌', required: true, type: 'string' })
  @SkipThrottle()
  @Post('refresh')
  async refresh(@Query('token') refreshToken: string) {
    return new R({
      data: await this.authService.refresh(refreshToken)
    })
  }
}
