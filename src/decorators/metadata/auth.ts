import { SetMetadata } from '@nestjs/common'

import { ROLES, SKIP_AUTH } from '@/constants'

// 跳过认证
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)

// 授权
export const Roles = (...roles: []) => SetMetadata(ROLES, roles)
