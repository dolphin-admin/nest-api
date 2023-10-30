import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { OperationLogsController } from './operation-logs.controller'
import { OperationLogsService } from './operation-logs.service'

describe('OperationLogsController', () => {
  let controller: OperationLogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationLogsController],
      providers: [OperationLogsService]
    }).compile()

    controller = module.get<OperationLogsController>(OperationLogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
