import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { R } from '@/class'

import { OnlineUsersService } from './online-users.service'

@ApiTags('在线用户')
@ApiBearerAuth('bearer')
@Controller('online-users')
export class OnlineUsersController {
  constructor(private readonly onlineUsersService: OnlineUsersService) {}

  @ApiOperation({ summary: '在线用户列表' })
  @Get()
  async findMany() {
    return new R({
      data: await this.onlineUsersService.findMany()
    })
  }
}
