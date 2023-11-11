import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'

import { BaseResponseVo } from '@/class'
import { ApiBaseResponse, ApiErrorResponse, ApiPageResponse } from '@/decorators'

import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingsService } from './settings.service'
import { SettingVo } from './vo'

@ApiTags('设置')
@ApiBearerAuth('bearer')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: '创建设置' })
  @ApiBaseResponse({ status: HttpStatus.CREATED })
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT)
  @ApiBody({ description: '设置信息', type: CreateSettingDto })
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    const setting = await this.settingsService.create(createSettingDto)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting),
      message: '创建成功'
    })
  }

  @ApiOperation({ summary: '设置列表' })
  @ApiPageResponse(SettingVo)
  @ApiErrorResponse()
  @Get()
  findMany() {
    return this.settingsService.findMany()
  }

  @ApiOperation({ summary: '设置详情 [ID]' })
  @ApiBaseResponse({ type: SettingVo })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'id', description: 'ID', required: true, example: 1 })
  @Get(':id(\\d+)')
  async findOneById(@Param('id', new ParseIntPipe()) id: number) {
    const setting = await this.settingsService.findOneById(id)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting)
    })
  }

  @ApiOperation({ summary: '设置详情 [Key]' })
  @ApiBaseResponse({ type: SettingVo })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'key', description: '键', required: true, example: 'SITE.GITHUB.REPO' })
  @Get(':key')
  async findOneByKey(@Param('key') key: string) {
    const setting = await this.settingsService.findOneByKey(key)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting)
    })
  }

  @ApiOperation({ summary: '修改设置' })
  @ApiBaseResponse({ type: SettingVo, description: '修改成功' })
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'id', description: 'ID', required: true, example: 1 })
  @Patch(':id(\\d+)')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto)
  }

  @ApiOperation({ summary: '删除设置' })
  @ApiBaseResponse({ type: SettingVo, description: '删除成功' })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'id', description: 'ID', required: true, example: 1 })
  @Delete(':id(\\d+)')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    await this.settingsService.remove(id)
    return new BaseResponseVo({
      message: '删除成功'
    })
  }
}
