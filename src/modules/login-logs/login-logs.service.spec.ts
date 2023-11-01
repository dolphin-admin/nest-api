import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { LoginLogsService } from './login-logs.service'

describe('LoginLogsService', () => {
  let service: LoginLogsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginLogsService]
    }).compile()

    service = module.get<LoginLogsService>(LoginLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
