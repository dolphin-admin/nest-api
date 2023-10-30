import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CronJobLogsController } from './cron-job-logs.controller'
import { CronJobLogsService } from './cron-job-logs.service'

describe('CronJobLogsController', () => {
  let controller: CronJobLogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronJobLogsController],
      providers: [CronJobLogsService]
    }).compile()

    controller = module.get<CronJobLogsController>(CronJobLogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
