import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { MenuItemsController } from './menu-items.controller'
import { MenuItemsService } from './menu-items.service'

describe('MenuItemsController', () => {
  let controller: MenuItemsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [MenuItemsService]
    }).compile()

    controller = module.get<MenuItemsController>(MenuItemsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
