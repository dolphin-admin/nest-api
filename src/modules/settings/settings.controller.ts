import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'

import { BaseResponseVo } from '@/class'
import {
  ApiBaseResponse,
  ApiErrorResponse,
  ApiPageQuery,
  ApiPageResponse,
  User
} from '@/decorators'

import { PageSettingDto } from './dto'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingsService } from './settings.service'
import { SettingVo } from './vo'
import { PageSettingVo } from './vo/page-setting-vo'

@ApiTags('系统设置')
@ApiBearerAuth('bearer')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: '创建设置' })
  @ApiBaseResponse({ status: HttpStatus.CREATED, type: SettingVo })
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT)
  @ApiBody({ description: '设置信息', type: CreateSettingDto })
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto, @User('sub') userId: number) {
    const setting = await this.settingsService.create(createSettingDto, userId)
    return new BaseResponseVo({
      data: plainToClass(SettingVo, setting),
      message: '创建成功'
    })
  }

  @ApiOperation({ summary: '设置列表' })
  @ApiPageResponse(SettingVo)
  @ApiErrorResponse()
  @ApiPageQuery('searchText', 'date')
  @Get()
  async findMany(@Query() pageSettingDto: PageSettingDto) {
    const result = await this.settingsService.findMany(pageSettingDto)
    return plainToClass(PageSettingVo, result)
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
  @ApiBody({ description: '设置信息', type: UpdateSettingDto })
  @Patch(':id(\\d+)')
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

  @ApiOperation({ summary: '删除设置' })
  @ApiBaseResponse({ description: '删除成功' })
  @ApiErrorResponse(HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'id', description: 'ID', required: true, example: 1 })
  @Delete(':id(\\d+)')
  async remove(@Param('id', new ParseIntPipe()) id: number, @User('sub') userId: number) {
    await this.settingsService.remove(id, userId)
    return new BaseResponseVo({
      message: '删除成功'
    })
  }
}
