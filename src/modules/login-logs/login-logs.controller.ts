import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { LoginLogsService } from './login-logs.service'

@ApiTags('登录日志')
@ApiBasicAuth('bearer')
@Controller('login-logs')
export class LoginLogsController {
  constructor(private readonly loginLogsService: LoginLogsService) {}
}
