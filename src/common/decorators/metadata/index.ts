import { SetMetadata } from '@nestjs/common'

import { AUTH, ROLES, SKIP_AUTH } from '@/common/constants'

// Auth
export const Auth = () => SetMetadata(AUTH, true)
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)

// Role
export const Roles = (...roles: []) => SetMetadata(ROLES, roles)
