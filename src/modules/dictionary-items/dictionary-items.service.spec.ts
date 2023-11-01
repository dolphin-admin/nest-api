import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { DictionaryItemsService } from './dictionary-items.service'

describe('DictionaryItemsService', () => {
  let service: DictionaryItemsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionaryItemsService]
    }).compile()

    service = module.get<DictionaryItemsService>(DictionaryItemsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
