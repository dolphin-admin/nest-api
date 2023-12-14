import { i18nValidationMessage } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'

export class I18nUtils {
  static t: typeof i18nValidationMessage<I18nTranslations> = i18nValidationMessage<I18nTranslations>
}
