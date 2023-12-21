import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { UserTrafficsService } from './user-traffics.service'

@ApiTags('用户流量')
@ApiBasicAuth('bearer')
@Controller('user-traffics')
export class UserTrafficsController {
  constructor(private readonly userTrafficsService: UserTrafficsService) {}
}
