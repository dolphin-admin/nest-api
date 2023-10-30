import { Controller } from '@nestjs/common'

import { CronJobLogsService } from './cron-job-logs.service'

@Controller('cron-job-logs')
export class CronJobLogsController {
  constructor(private readonly cronJobLogsService: CronJobLogsService) {}
}
