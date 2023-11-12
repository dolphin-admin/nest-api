import { Transform } from 'class-transformer'

/**
 * 去除字符串两端的空格
 */
export function Trim() {
  return Transform(({ value }: { value: string | undefined | null }) => value?.trim())
}
