import { i18nValidationMessage } from 'nestjs-i18n'

import type { MultilingualDto } from '@/class'
import { LanguageCode } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'

type TransRaw<T> = {
  lang: string
} & Partial<T>

type TransResult = Record<string, string>

export class I18nUtils {
  static t: typeof i18nValidationMessage<I18nTranslations> = i18nValidationMessage<I18nTranslations>

  /**
   * 根据多语言关联表数组生成多语言对象
   * @param trans 多语言关联项数组
   * @param keys 多语言关联项的键数组
   * @returns 多语言对象
   *
   * @example
   * I18nUtils.generateTransByKeys<Trans>(trans, ['label', 'remark'])
   *
   * 原本：
   * ```
   * [
   *   { lang: 'zh-CN', label: '标签', remark: '备注' },
   *   { lang: 'en-US', label: 'Label', remark: 'Remark' }
   * ]
   * ```
   *
   * 根据传递的 Keys（即需要转化多语言的列字段）:
   * ```
   * ['label', 'remark']
   * ```
   *
   * 转化为：
   * ```
   * {
   *   label: { 'zh-CN': '标签', 'en-US': 'Label' },
   *   remark: { 'zh-CN': '备注', 'en-US': 'Remark' }
   * }
   * ```
   */
  static generateTransByKeys<T = any>(
    trans: TransRaw<T>[],
    keys: (keyof T)[]
  ): Record<keyof T, TransResult> {
    return keys.reduce(
      (prev, curr) => {
        // eslint-disable-next-line no-param-reassign
        prev[curr] = trans.reduce((p, c) => {
          const { lang } = c
          // eslint-disable-next-line no-param-reassign
          p[lang] = c[curr] as string
          return p
        }, {} as TransResult)
        return prev
      },
      {} as Record<keyof T, TransResult>
    )
  }

  /**
   * 创建多语言关联表数组数据
   * @param keys Dto 复合对象
   * @param userId 用户 ID
   * @returns 多语言关联表数组数据
   *
   * @example
   * I18nUtils.createTrans<CreateDictionaryDto>(keys, userId)
   *
   * 原本前端传递的 Dto 复合对象：
   * ```
   * {
   *  label: {
   *   'zh-CN': '标签',
   *   'en-US': 'Label'
   *  }
   *  remark: {
   *  'zh-CN': '备注',
   *  'en-US': 'Remark'
   *  }
   * }
   * ```
   *
   * 转化为 Prisma 需要创建的数据：
   * ```
   * [
   *  { lang: 'zh-CN', label: '标签', remark: '备注', createdBy: 1 },
   *  { lang: 'en-US', label: 'Label', remark: 'Remark', createdBy: 1 }
   * ]
   */
  static createTrans<T = any>(
    keys: Partial<Record<keyof T, MultilingualDto>>,
    userId?: number
  ): T[] {
    return Object.values(LanguageCode).map((lang) => {
      const result: Record<string, unknown> = {
        lang
      }
      if (userId) {
        result.createdBy = userId
      }
      Object.keys(keys).forEach((key) => {
        result[key] = keys[key as keyof T]?.[lang]
      })
      return result as T
    })
  }
}
