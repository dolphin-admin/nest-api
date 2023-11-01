import { Module } from '@nestjs/common'

import { CronJobsController } from './cron-jobs.controller'
import { CronJobsService } from './cron-jobs.service'

@Module({
  controllers: [CronJobsController],
  providers: [CronJobsService]
})
export class CronJobsModule {}
