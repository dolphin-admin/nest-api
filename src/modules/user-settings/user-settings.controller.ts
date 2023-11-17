import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'

import { BaseResponseVo } from '@/class'
import { User } from '@/decorators'

import { PageUserSettingDto, UpdateUserSettingDto } from './dto'
import { CreateUserSettingDto } from './dto/create-user-setting.dto'
import { UserSettingsService } from './user-settings.service'
import { PageUserSettingVo, UserSettingVo } from './vo'

@ApiTags('用户设置')
@ApiBearerAuth('bearer')
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @ApiOperation({ summary: '创建用户设置' })
  @Post()
  async create(@Body() createUserSettingDto: CreateUserSettingDto, @User('sub') userId: number) {
    const userSetting = await this.userSettingsService.create(createUserSettingDto, userId)
    return new BaseResponseVo({
      data: plainToClass(UserSettingVo, userSetting),
      message: '创建成功'
    })
  }

  @ApiOperation({ summary: '用户设置列表' })
  @Get()
  async findMany(@Query() pageUserSettingDto: PageUserSettingDto) {
    const result = await this.userSettingsService.findMany(pageUserSettingDto)
    return plainToClass(PageUserSettingVo, result)
  }

  @ApiOperation({ summary: '用户设置详情 [ID]' })
  @Get(':id(\\d+)')
  findOneById(@Param('id', new ParseIntPipe()) id: number) {
    const userSetting = this.userSettingsService.findOneById(id)
    return new BaseResponseVo({
      data: plainToClass(UserSettingVo, userSetting)
    })
  }

  @ApiOperation({ summary: '用户设置详情 [Key]' })
  @Get(':key')
  findOneByKey(@Param('key') key: string) {
    return this.userSettingsService.findOneByKey(key)
  }

  @ApiOperation({ summary: '更新用户设置' })
  @Patch(':id(\\d+)')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
    @User('sub') userId: number
  ) {
    return this.userSettingsService.update(id, updateUserSettingDto, userId)
  }

  @ApiOperation({ summary: '删除用户设置' })
  @Delete(':id(\\d+)')
  async remove(@Param('id', new ParseIntPipe()) id: number, @User('sub') userId: number) {
    await this.userSettingsService.remove(id, userId)
    return new BaseResponseVo({
      message: '删除成功'
    })
  }
}
