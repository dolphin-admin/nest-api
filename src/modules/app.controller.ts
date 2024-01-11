import { Controller, Get, Render } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { R } from '@/class'
import { SkipAuth } from '@/decorators'

import { AppService } from './app.service'

@ApiTags('应用')
@SkipAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '应用首页' })
  @Render('index')
  @Get()
  getApp() {
    return {
      title: 'Dolphin Admin Nest'
    }
  }

  @ApiOperation({ summary: '应用信息' })
  @Get('info')
  getVersion() {
    return new R({
      data: this.appService.getAppInfo()
    })
  }
}
