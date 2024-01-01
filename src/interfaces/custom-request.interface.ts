import type { Request } from 'express'

import type { JwtPayload } from './jwt-payload.interface'

export interface CustomRequest extends Request {
  jwtPayload?: JwtPayload
}
