import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  ParseEnumPipe,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotImplementedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo } from '@/class'
import { ApiBaseResponse, SkipAuth } from '@/decorators'
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
  @ApiBaseResponse({
    description: '注册成功',
    status: HttpStatus.CREATED,
    type: AuthVo
  })
  @ApiBadRequestResponse({ description: '输入有误' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiConflictResponse({ description: '用户名已存在' })
  @Post('signup')
  signup() {
    return this.authService.signup()
  }

  @ApiOperation({ summary: '登录' })
  @ApiBaseResponse({ description: '登录成功', type: AuthVo })
  @ApiBadRequestResponse({ description: '用户名或密码不正确' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiNotImplementedResponse({ description: '不支持该登录方式' })
  @ApiQuery({
    name: 'type',
    type: Number,
    description: '登录类型，支持用户名、邮箱登录',
    required: true,
    enum: LoginType,
    example: LoginType.USERNAME
  })
  @ApiBody({
    type: LoginDto,
    description: '登录信息',
    examples: {
      admin: {
        value: {
          username: 'admin',
          password: '123456'
        },
        description: '测试超级管理员登录'
      },
      visitor: {
        value: {
          username: 'visitor',
          password: '123456'
        },
        description: '测试访客登录'
      }
    }
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query(
      'type',
      new ParseEnumPipe(LoginType, {
        exceptionFactory: () => {
          const i18n = I18nContext.current<I18nTranslations>()!
          throw new BadRequestException(i18n.t('auth.LOGIN.TYPE_NOT_SUPPORTED'))
        }
      })
    )
    type: LoginType,
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
}
