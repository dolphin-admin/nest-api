import { Transform } from 'class-transformer'

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (!value) {
        return undefined
      }
      if (!Array.isArray(value)) {
        return value.toUpperCase()
      }
      return value.map((v) => v.toUpperCase())
    },
    { toClassOnly: true }
  )
}
