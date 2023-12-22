import { Transform } from 'class-transformer'

export function ToInt(): PropertyDecorator {
  return Transform(({ value }) => Number.parseInt(value, 10), {
    toClassOnly: true
  })
}
