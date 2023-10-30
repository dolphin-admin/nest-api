import { Injectable } from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from './generated/i18n.generated'

@Injectable()
export class AppService {
  constructor(private readonly i18nService: I18nService<I18nTranslations>) {}

  getAppInfo() {
    return {
      name: this.i18nService.t('common.APP.NAME', {
        lang: I18nContext.current()?.lang
      }),
      version: '1.0.0'
    }
  }
}
