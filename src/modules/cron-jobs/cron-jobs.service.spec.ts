import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CronJobsService } from './cron-jobs.service'

describe('CronJobsService', () => {
  let service: CronJobsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronJobsService]
    }).compile()

    service = module.get<CronJobsService>(CronJobsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
