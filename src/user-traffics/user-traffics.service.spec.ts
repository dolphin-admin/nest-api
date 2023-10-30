import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UserTrafficsService } from './user-traffics.service'

describe('UserTrafficsService', () => {
  let service: UserTrafficsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTrafficsService]
    }).compile()

    service = module.get<UserTrafficsService>(UserTrafficsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
