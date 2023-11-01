import type { Request } from 'express'

import type { JWTPayload } from './jwt-payload.interface'

export interface CustomRequest extends Request {
  user?: JWTPayload
}
