import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { PositionsService } from './positions.service'

describe('PositionsService', () => {
  let service: PositionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsService]
    }).compile()

    service = module.get<PositionsService>(PositionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
