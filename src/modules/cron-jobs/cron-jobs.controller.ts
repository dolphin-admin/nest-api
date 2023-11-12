import { Controller, Post } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { CronJobsService } from './cron-jobs.service'

@ApiTags('定时任务')
@ApiBasicAuth('bearer')
@Controller('cron-jobs')
export class CronJobsController {
  constructor(private readonly cronJobsService: CronJobsService) {}

  @Post('')
  create() {
    return this.cronJobsService.create()
  }
}
