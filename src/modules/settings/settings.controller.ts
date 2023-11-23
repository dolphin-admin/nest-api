import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'

import { BaseResponseVo } from '@/class'
import { User } from '@/decorators'

import { PageSettingDto } from './dto'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingsService } from './settings.service'
import { SettingVo } from './vo'
import { PageSettingVo } from './vo/page-setting.vo'

@ApiTags('系统设置')
@ApiBearerAuth('bearer')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: '创建设置' })
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto, @User('sub') userId: number) {
    const setting = await this.settingsService.create(createSettingDto, userId)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting),
      message: '创建成功'
    })
  }

  @ApiOperation({ summary: '设置列表' })
  @Get()
  async findMany(@Query() pageSettingDto: PageSettingDto) {
    const result = await this.settingsService.findMany(pageSettingDto)
    return plainToClass(PageSettingVo, result)
  }

  @ApiOperation({ summary: '设置详情 [ID]' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id', new ParseIntPipe()) id: number) {
    const setting = await this.settingsService.findOneById(id)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting)
    })
  }

  @ApiOperation({ summary: '设置详情 [Key]' })
  @Get(':key')
  async findOneByKey(@Param('key') key: string) {
    const setting = await this.settingsService.findOneByKey(key)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting)
    })
  }

  @ApiOperation({ summary: '修改设置' })
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateSettingDto: UpdateSettingDto,
    @User('sub') userId: number
  ) {
    const setting = await this.settingsService.update(id, updateSettingDto, userId)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting),
      message: '修改成功'
    })
  }

  @ApiOperation({ summary: '启用设置' })
  @Patch(':id(\\d+)/enable')
  async enable(@Param('id', new ParseIntPipe()) id: number, @User('sub') userId: number) {
    await this.settingsService.enable(id, userId)
    return new BaseResponseVo({
      message: '启用成功'
    })
  }

  @ApiOperation({ summary: '禁用设置' })
  @Patch(':id(\\d+)/disable')
  async disable(@Param('id', new ParseIntPipe()) id: number, @User('sub') userId: number) {
    await this.settingsService.disable(id, userId)
    return new BaseResponseVo({
      message: '禁用成功'
    })
  }

  @ApiOperation({ summary: '排序设置' })
  @Patch(':id(\\d+)/sort/:targetId(\\d+)')
  async sort(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('targetId', new ParseIntPipe()) targetId: number,
    @User('sub') userId: number
  ) {
    await this.settingsService.sort(id, targetId, userId)
    return new BaseResponseVo({
      message: '排序成功'
    })
  }

  @ApiOperation({ summary: '删除设置' })
  @Delete(':id(\\d+)')
  async remove(@Param('id', new ParseIntPipe()) id: number, @User('sub') userId: number) {
    await this.settingsService.remove(id, userId)
    return new BaseResponseVo({
      message: '删除成功'
    })
  }
}
