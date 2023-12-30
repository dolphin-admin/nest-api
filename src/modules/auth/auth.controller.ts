import {
  Body,
  Controller,
  Inject,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { AppConfig } from '@/configs'
import {
  ApiCreatedObjectResponse,
  ApiOkObjectResponse,
  ApiOkResponse,
  Cookies,
  Jwt,
  SkipAuth
} from '@/decorators'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { RefreshTokenGuard } from '@/guards'

import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './dto'
import { TokenVo } from './vo'

@ApiTags('认证')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>
  ) {}

  @ApiOperation({ summary: '注册' })
  @ApiCreatedObjectResponse(TokenVo)
  @SkipThrottle()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @I18n() i18n: I18nContext<I18nTranslations>) {
    return new R({
      data: await this.authService.signup(signupDto),
      msg: i18n.t('auth.SIGN.UP.SUCCESS')
    })
  }

  @ApiOperation({ summary: '登录' })
  @ApiOkObjectResponse(TokenVo)
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
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { tokenVo, sid } = await this.authService.login(loginDto, type, req)

    res.cookie('sid', sid, { httpOnly: true, secure: !this.appConfig.isDEV })

    return new R({
      data: tokenVo,
      msg: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '登出' })
  @ApiOkResponse()
  @Post('logout')
  async logout(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Res({ passthrough: true }) res: Response,
    @Cookies('sid') sid: string
  ) {
    await this.authService.logout(sid)

    res.clearCookie('sid')

    return new R({
      msg: i18n.t('auth.LOGOUT.SUCCESS')
    })
  }

  @ApiOperation({ summary: '强制下线' })
  @ApiOkResponse()
  @ApiQuery({ name: 'sid', description: 'Session ID', required: true, type: 'string' })
  @Post('force-logout')
  async forceLogout(@I18n() i18n: I18nContext<I18nTranslations>, @Query('sid') sid: string) {
    await this.authService.forceLogout(sid)
    return new R({
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiOkObjectResponse(TokenVo)
  @ApiQuery({ name: 'token', description: '刷新令牌', required: true, type: 'string' })
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Jwt('sub') userId: number, @Cookies('sid') sid: string) {
    const data = await this.authService.refreshTokens(userId, sid)
    return new R({
      data
    })
  }
}
