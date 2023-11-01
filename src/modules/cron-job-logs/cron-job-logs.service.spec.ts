import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CronJobLogsService } from './cron-job-logs.service'

describe('CronJobLogsService', () => {
  let service: CronJobLogsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronJobLogsService]
    }).compile()

    service = module.get<CronJobLogsService>(CronJobLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
