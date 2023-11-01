import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CronJobsController } from './cron-jobs.controller'
import { CronJobsService } from './cron-jobs.service'

describe('CronJobsController', () => {
  let controller: CronJobsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronJobsController],
      providers: [CronJobsService]
    }).compile()

    controller = module.get<CronJobsController>(CronJobsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
