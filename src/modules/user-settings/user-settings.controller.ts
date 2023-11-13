import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CreateUserSettingDto } from './dto/create-user-setting.dto'
import { UpdateUserSettingDto } from './dto/update-user-setting.dto'
import { UserSettingsService } from './user-settings.service'

@ApiTags('用户设置')
@ApiBearerAuth('bearer')
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @ApiOperation({ summary: '创建用户设置' })
  @Post()
  create(@Body() createUserSettingDto: CreateUserSettingDto) {
    return this.userSettingsService.create(createUserSettingDto)
  }

  @ApiOperation({ summary: '用户设置列表' })
  @Get()
  findMany() {
    return this.userSettingsService.findAll()
  }

  @ApiOperation({ summary: '用户设置详情 [ID]' })
  @Get(':id(\\d+)')
  findOneById(@Param('id') id: number) {
    return this.userSettingsService.findOne(+id)
  }

  @ApiOperation({ summary: '用户设置详情 [Key]' })
  @Get(':id(\\d+)')
  findOneByKey(@Param('id') id: string) {
    return this.userSettingsService.findOne(+id)
  }

  @ApiOperation({ summary: '更新用户设置' })
  @Patch(':id(\\d+)')
  update(@Param('id') id: string, @Body() updateUserSettingDto: UpdateUserSettingDto) {
    return this.userSettingsService.update(+id, updateUserSettingDto)
  }

  @ApiOperation({ summary: '删除用户设置' })
  @Delete(':id(\\d+)')
  remove(@Param('id') id: string) {
    return this.userSettingsService.remove(+id)
  }
}
