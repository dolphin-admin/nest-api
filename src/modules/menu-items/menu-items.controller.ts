import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { MenuItemsService } from './menu-items.service'

@ApiTags('菜单')
@ApiBasicAuth('bearer')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}
}
