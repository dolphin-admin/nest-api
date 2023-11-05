import { ConfigModule } from '@nestjs/config'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CosService } from './cos.service'

describe('CosService', () => {
  let service: CosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CosService]
    }).compile()

    service = module.get<CosService>(CosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
