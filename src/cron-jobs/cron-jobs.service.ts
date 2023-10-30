import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CronJobsService {
  private readonly logger = new Logger(CronJobsService.name)

  @Cron(CronExpression.EVERY_10_HOURS)
  handleCron() {
    this.logger.debug('Running Cron Job..')
  }
}
