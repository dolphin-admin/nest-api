import { Transform } from 'class-transformer'

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (!value) {
        return undefined
      }
      if (!Array.isArray(value)) {
        return value.toLowerCase()
      }
      return value.map((v) => v.toLowerCase())
    },
    { toClassOnly: true }
  )
}
