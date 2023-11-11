import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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
    if (!setting) {
      throw new NotFoundException('设置不存在')
    }
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting)
    })
  }

  @ApiOperation({ summary: '设置详情 [Key]' })
  @ApiBaseResponse({ type: SettingVo })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @Get(':key')
  findOneByKey(key: string) {
    return this.settingsService.findOneByKey(key)
  }

  @ApiOperation({ summary: '更新设置' })
  @ApiBaseResponse({ type: SettingVo })
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateSettingDto)
  }

  @ApiOperation({ summary: '删除设置' })
  @ApiBaseResponse({ type: SettingVo })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id)
  }
}
