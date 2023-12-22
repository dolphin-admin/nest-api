import { Transform } from 'class-transformer'

/**
 * Query 的时间、日期转换为 ISO 字符串
 */
export function ToISOString(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      try {
        return new Date(value).toISOString()
      } catch {
        return undefined
      }
    },
    { toClassOnly: true }
  )
}
