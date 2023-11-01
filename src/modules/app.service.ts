import { Injectable } from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '../generated/i18n.generated'
import { AppConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(private readonly i18nService: I18nService<I18nTranslations>) {}

  getAppInfo() {
    return {
      name: this.i18nService.t('common.APP.NAME', {
        lang: I18nContext.current()?.lang
      }),
      version: AppConfig.APP_VERSION
    }
  }
}
