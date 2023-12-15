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
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { ApiPageQuery, User } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { PageSettingDto } from './dto'
import { CreateSettingDto } from './dto/create-setting.dto'
import { PatchSettingDto } from './dto/patch-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingsService } from './settings.service'

@ApiTags('系统设置')
@ApiBearerAuth('bearer')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: '创建设置' })
  @Post()
  async create(
    @Body() createSettingDto: CreateSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.settingsService.create(createSettingDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '设置列表' })
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findMany(@Query() pageSettingDto: PageSettingDto) {
    return new R({
      data: await this.settingsService.findMany(pageSettingDto)
    })
  }

  @ApiOperation({ summary: '设置详情 [ID]' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id', new ParseIntPipe()) id: number) {
    return new R({
      data: await this.settingsService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '设置详情 [Key]' })
  @Get(':key')
  async findOneByKey(@Param('key') key: string) {
    return new R({
      data: await this.settingsService.findOneByKey(key)
    })
  }

  @ApiOperation({ summary: '更新设置' })
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateSettingDto: UpdateSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.settingsService.update(id, updateSettingDto, userId),
      msg: i18n.t('common.UPDATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改设置' })
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchSettingDto: PatchSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.settingsService.patch(id, patchSettingDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除设置' })
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.settingsService.remove(id, userId)
    return new R({
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
