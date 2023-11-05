import { SetMetadata } from '@nestjs/common'

import { AUTH, ROLES, SKIP_AUTH } from '@/constants'

// 认证
export const Auth = () => SetMetadata(AUTH, true)
// 跳过认证
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)

// 授权
export const Roles = (...roles: []) => SetMetadata(ROLES, roles)
