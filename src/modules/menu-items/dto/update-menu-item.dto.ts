import { PartialType } from '@nestjs/swagger'

import { CreateMenuItemDto } from './create-menu-item.dto'

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
