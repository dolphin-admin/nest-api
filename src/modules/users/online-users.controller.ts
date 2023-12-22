import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { ApiOkResponse } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

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

  @ApiOperation({ summary: '强制下线' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.onlineUsersService.remove(id)
    return new R({
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }
}
