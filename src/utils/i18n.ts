import { i18nValidationMessage } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'

export const i18nMessage = i18nValidationMessage<I18nTranslations>
