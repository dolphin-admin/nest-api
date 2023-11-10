import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import type { User } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo } from '@/class'
import { ApiBadResponse, ApiBaseResponse, Auth, SkipAuth } from '@/decorators'
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
  @ApiBaseResponse({ description: '注册成功', status: HttpStatus.CREATED, type: AuthVo })
  @ApiBadResponse([
    HttpStatus.BAD_REQUEST,
    { status: HttpStatus.CONFLICT, description: '用户名已存在' }
  ])
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
  @ApiBaseResponse({ description: '登录成功', type: AuthVo })
  @ApiBadResponse([
    { status: HttpStatus.BAD_REQUEST, description: '用户名或密码不正确' },
    { status: HttpStatus.NOT_IMPLEMENTED, description: '不支持该登录方式' }
  ])
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
  @ApiBaseResponse({ description: '退出成功' })
  @ApiBadResponse([{ status: HttpStatus.NOT_FOUND, description: '该用户已退出' }])
  @Auth()
  @Get('logout')
  logout() {
    return new BaseResponseVo({
      message: '退出成功'
    })
  }
}
