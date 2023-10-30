import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { MenuItemsService } from './menu-items.service'

describe('MenuItemsService', () => {
  let service: MenuItemsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuItemsService]
    }).compile()

    service = module.get<MenuItemsService>(MenuItemsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
