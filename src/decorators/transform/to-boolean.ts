import { Transform } from 'class-transformer'

export function ToBoolean(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      switch (value) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          return value
      }
    },
    { toClassOnly: true }
  )
}
