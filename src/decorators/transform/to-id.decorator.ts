import { Transform } from 'class-transformer'

/**
 * Query 的 ID 转换为 number 类型
 */
export function ToId(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      const number = value ? +value : 0
      return Number.isInteger(number) && number > 0 ? number : undefined
    },
    { toClassOnly: true }
  )
}
