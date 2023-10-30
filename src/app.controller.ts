import { Controller, Get, Inject, Redirect, Render } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { AppService } from './app.service'
import { ApiBaseResponse, BaseResponseVo } from './common'
import type { I18nTranslations } from './generated/i18n.generated'

@ApiTags('应用')
@Controller()
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService

  @ApiOperation({ summary: '应用首页' })
  @ApiBaseResponse()
  @Render('index')
  @Get()
  getApp() {
    return { title: 'Nest TypeScript Starter Template' }
  }

  @ApiOperation({ summary: '应用信息' })
  @ApiBaseResponse()
  @Get('app-info')
  getVersion(@I18n() i18n: I18nContext<I18nTranslations>) {
    const appInfo = this.appService.getAppInfo()
    appInfo.name = i18n.t('common.APP.NAME')
    return new BaseResponseVo({
      data: appInfo
    })
  }

  @ApiOperation({ summary: '测试重定向' })
  @ApiBaseResponse()
  @Redirect('/')
  @Get('redirect')
  getRedirect() {}

  @ApiOperation({ summary: '语言标识' })
  @ApiBaseResponse()
  @Get('lang')
  getCurrentLang(@I18n() i18n: I18nContext<I18nTranslations>) {
    return new BaseResponseVo({
      data: i18n.lang
    })
  }
}
