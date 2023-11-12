import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { CronJobLogsService } from './cron-job-logs.service'

@ApiTags('定时任务日志')
@ApiBasicAuth('bearer')
@Controller('cron-job-logs')
export class CronJobLogsController {
  constructor(private readonly cronJobLogsService: CronJobLogsService) {}
}
