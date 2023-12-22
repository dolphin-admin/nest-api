import { Transform } from 'class-transformer'
import { isNil, map, trim } from 'lodash'

export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: string | undefined | null | string[] }) => {
    if (isNil(value)) {
      return value
    }
    if (Array.isArray(value)) {
      return map(value, (v) => trim(v).replaceAll(/\s\s+/g, ' '))
    }
    return trim(value).replaceAll(/\s\s+/g, ' ')
  })
}
