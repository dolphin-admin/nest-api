import { Transform } from 'class-transformer'

/**
 * Query 的 ID 转换为 number 类型
 */
export function ToId() {
  return Transform(({ value }: { value: string | undefined | null }) => {
    const number = value ? +value : 0
    return Number.isInteger(number) && number > 0 ? number : undefined
  })
}
