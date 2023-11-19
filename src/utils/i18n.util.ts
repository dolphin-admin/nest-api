import { i18nValidationMessage } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'

export class I18nUtils {
  static t: typeof i18nValidationMessage<I18nTranslations> = i18nValidationMessage<I18nTranslations>

  /**
   * 返回多语言对象
   * @param trans 多语言关联项数组
   * @param key 多语言关联项的键
   * @returns 多语言对象
   */
  static generateTrans<T = any>(trans: any[], key: keyof T): Record<string, unknown> {
    return trans.reduce<Record<string, unknown>>((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[curr.lang] = curr[key]
      return prev
    }, {})
  }
}
