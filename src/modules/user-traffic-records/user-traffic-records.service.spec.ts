import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UserTrafficRecordsService } from './user-traffic-records.service'

describe('UserTrafficRecordsService', () => {
  let service: UserTrafficRecordsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTrafficRecordsService]
    }).compile()

    service = module.get<UserTrafficRecordsService>(UserTrafficRecordsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
