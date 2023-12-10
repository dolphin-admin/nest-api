import { Transform } from 'class-transformer'
import { castArray, isNil } from 'lodash'

export function ToArray(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (isNil(value)) {
        return []
      }
      return castArray(value)
    },
    { toClassOnly: true }
  )
}
