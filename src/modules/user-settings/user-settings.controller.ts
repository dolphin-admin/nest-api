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

import { PageUserSettingDto, PatchUserSettingDto, UpdateUserSettingDto } from './dto'
import { CreateUserSettingDto } from './dto/create-user-setting.dto'
import { UserSettingsService } from './user-settings.service'

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
  ) {
    return new R({
      data: await this.userSettingsService.create(createUserSettingDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '用户设置列表' })
  @Get()
  async findMany(@Query() pageUserSettingDto: PageUserSettingDto) {
    return new R({
      data: await this.userSettingsService.findMany(pageUserSettingDto)
    })
  }

  @ApiOperation({ summary: '用户设置详情 [ID]' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id', new ParseIntPipe()) id: number) {
    return new R({
      data: await this.userSettingsService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '用户设置详情 [Key]' })
  @Get(':key')
  async findOneByKey(@Param('key') key: string) {
    return new R({
      data: await this.userSettingsService.findOneByKey(key)
    })
  }

  @ApiOperation({ summary: '更新用户设置' })
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.userSettingsService.update(id, updateUserSettingDto, userId),
      msg: i18n.t('common.UPDATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改用户设置' })
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchUserSettingDto: PatchUserSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      msg: i18n.t('common.ENABLE.SUCCESS'),
      data: await this.userSettingsService.patch(id, patchUserSettingDto, userId)
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
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
