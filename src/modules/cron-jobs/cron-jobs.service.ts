import { Injectable, Logger } from '@nestjs/common'
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
  Timeout
} from '@nestjs/schedule'
import { CronJob } from 'cron'

@Injectable()
export class CronJobsService {
  private readonly logger = new Logger(CronJobsService.name)

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  handleCron() {
    this.logger.debug('Running Cron Job..')
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Running Interval Job..')
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Running Timeout Job..')
  }

  // 创建定时任务
  create() {
    const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => {
      this.logger.log('Doing something...')
    })
    this.schedulerRegistry.addCronJob('DEFAULT_CRON', job)
    job.start()
  }
}
