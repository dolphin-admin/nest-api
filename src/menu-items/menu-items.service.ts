import { Injectable } from '@nestjs/common'

import type { CreateMenuItemDto } from './dto/create-menu-item.dto'
import type { UpdateMenuItemDto } from './dto/update-menu-item.dto'

@Injectable()
export class MenuItemsService {
  create(createMenuItemDto: CreateMenuItemDto) {
    return createMenuItemDto
  }

  findAll() {
    return 'This action returns all menuItems'
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return updateMenuItemDto
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`
  }
}
