import { Controller, Get, Inject, Redirect, Render } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { SkipAuth } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { AppService } from './app.service'

@ApiTags('应用')
@SkipAuth()
@Controller()
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService

  @ApiOperation({ summary: '应用首页' })
  @Render('index')
  @Get()
  getApp() {
    return { title: 'Dolphin Admin Nest' }
  }

  @ApiOperation({ summary: '应用信息' })
  @Get('app-info')
  getVersion() {
    return new R({
      data: this.appService.getAppInfo()
    })
  }

  @ApiOperation({ summary: '测试重定向' })
  @Redirect('/')
  @Get('redirect')
  getRedirect() {}

  @ApiOperation({ summary: '语言标识' })
  @Get('lang')
  getCurrentLang(@I18n() i18n: I18nContext<I18nTranslations>) {
    return new R({
      data: i18n.lang
    })
  }
}
