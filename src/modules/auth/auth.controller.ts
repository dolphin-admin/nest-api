import {
  Body,
  Controller,
  Inject,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { AppConfig } from '@/configs'
import {
  ApiCreatedObjectResponse,
  ApiOkObjectResponse,
  ApiOkResponse,
  Jwt,
  SkipAuth
} from '@/decorators'
import { LoginType } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { RefreshTokenGuard } from '@/guards'
import { CustomRequest, JwtPayload } from '@/interfaces'

import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './dto'
import { TokenVo } from './vo'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>
  ) {}

  @ApiOperation({ summary: '注册' })
  @ApiCreatedObjectResponse(TokenVo)
  @SkipThrottle()
  @SkipAuth()
  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Req() req: CustomRequest
  ) {
    return new R({
      data: await this.authService.signup(signupDto, req),
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
  @SkipAuth()
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
    @Req() req: CustomRequest
  ) {
    return new R({
      data: await this.authService.login(loginDto, type, req),
      msg: i18n.t('auth.LOGIN.SUCCESS')
    })
  }

  @ApiOperation({ summary: '登出' })
  @ApiOkResponse()
  @Post('logout')
  async logout(@Jwt('jti') jti: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.authService.logout(jti)
    return new R({
      msg: i18n.t('auth.LOGOUT.SUCCESS')
    })
  }

  @ApiOperation({ summary: '强制下线' })
  @ApiOkResponse()
  @ApiQuery({ name: 'jti', description: 'Jwt ID', required: true, type: 'string' })
  @Post('force-logout')
  async forceLogout(@Query('jti') jti: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.authService.logout(jti)
    return new R({
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiOkObjectResponse(TokenVo)
  @ApiQuery({ name: 'token', description: '刷新令牌', required: true, type: 'string' })
  @SkipThrottle()
  @SkipAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Jwt() jwtPayload: JwtPayload) {
    const data = await this.authService.refreshTokens(jwtPayload)
    return new R({
      data
    })
  }
}
