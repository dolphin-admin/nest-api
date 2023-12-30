import { SetMetadata } from '@nestjs/common'

import { SKIP_AUTH } from '@/constants'

// 跳过认证
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)
