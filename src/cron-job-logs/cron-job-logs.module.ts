import { Module } from '@nestjs/common'

import { CronJobLogsController } from './cron-job-logs.controller'
import { CronJobLogsService } from './cron-job-logs.service'

@Module({
  controllers: [CronJobLogsController],
  providers: [CronJobLogsService]
})
export class CronJobLogsModule {}
