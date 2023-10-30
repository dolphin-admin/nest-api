import { Controller } from '@nestjs/common'

import { CronJobsService } from './cron-jobs.service'

@Controller('cron-jobs')
export class CronJobsController {
  constructor(private readonly cronJobsService: CronJobsService) {}
}
