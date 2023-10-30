import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { LoginLogsController } from './login-logs.controller'
import { LoginLogsService } from './login-logs.service'

describe('LoginLogsController', () => {
  let controller: LoginLogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginLogsController],
      providers: [LoginLogsService]
    }).compile()

    controller = module.get<LoginLogsController>(LoginLogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
