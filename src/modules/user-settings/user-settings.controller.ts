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
import { User } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { PageUserSettingDto, UpdateUserSettingDto } from './dto'
import { CreateUserSettingDto } from './dto/create-user-setting.dto'
import { UserSettingsService } from './user-settings.service'
import type { PageUserSettingVo, UserSettingVo } from './vo'

@ApiTags('用户设置')
@ApiBearerAuth('bearer')
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @ApiOperation({ summary: '创建用户设置' })
  @Post()
  async create(
    @Body() createUserSettingDto: CreateUserSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R<UserSettingVo>> {
    return new R({
      data: await this.userSettingsService.create(createUserSettingDto, userId),
      message: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '用户设置列表' })
  @Get()
  async findMany(@Query() pageUserSettingDto: PageUserSettingDto): Promise<R<PageUserSettingVo>> {
    return new R({
      data: await this.userSettingsService.findMany(pageUserSettingDto)
    })
  }

  @ApiOperation({ summary: '用户设置详情 [ID]' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id', new ParseIntPipe()) id: number): Promise<R<UserSettingVo>> {
    return new R({
      data: await this.userSettingsService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '用户设置详情 [Key]' })
  @Get(':key')
  async findOneByKey(@Param('key') key: string): Promise<R<UserSettingVo>> {
    return new R({
      data: await this.userSettingsService.findOneByKey(key)
    })
  }

  @ApiOperation({ summary: '修改用户设置' })
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
    @User('sub') userId: number
  ): Promise<R<UserSettingVo>> {
    return new R({
      data: await this.userSettingsService.update(id, updateUserSettingDto, userId)
    })
  }

  @ApiOperation({ summary: '启用用户设置' })
  @Patch(':id(\\d+)/enable')
  async enable(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.userSettingsService.enable(id, userId)
    return new R({
      message: i18n.t('common.ENABLE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '禁用设置' })
  @Patch(':id(\\d+)/disable')
  async disable(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.userSettingsService.disable(id, userId)
    return new R({
      message: i18n.t('common.DISABLE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除用户设置' })
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.userSettingsService.remove(id, userId)
    return new R({
      message: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
