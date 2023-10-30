import { Controller } from '@nestjs/common'

import { LoginLogsService } from './login-logs.service'

@Controller('login-logs')
export class LoginLogsController {
  constructor(private readonly loginLogsService: LoginLogsService) {}
}
