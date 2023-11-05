import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { AppConfig } from '@/configs'

import type { I18nTranslations } from '../generated/i18n.generated'

@Injectable()
export class AppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>
  ) {}

  getAppInfo() {
    const i18n = I18nContext.current()
    return {
      name: this.i18nService.t('common.APP.NAME', {
        lang: i18n?.lang
      }),
      version: this.appConfig.version
    }
  }
}
