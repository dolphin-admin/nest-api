import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { OperationLogsService } from './operation-logs.service'

describe('OperationLogsService', () => {
  let service: OperationLogsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationLogsService]
    }).compile()

    service = module.get<OperationLogsService>(OperationLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
