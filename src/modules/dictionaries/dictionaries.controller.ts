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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { ApiPageQuery, User } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { DictionariesService } from './dictionaries.service'
import { CreateDictionaryDto, PageDictionaryDto, PatchSettingDto, UpdateDictionaryDto } from './dto'
import type { DictionaryVo, PageDictionaryVo } from './vo'

@ApiTags('字典')
@ApiBearerAuth('bearer')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @ApiOperation({ summary: '创建字典' })
  @ApiCreatedResponse({ description: '创建成功' })
  @ApiBadRequestResponse({ description: '输入有误' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @Post()
  async create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R<DictionaryVo>> {
    return new R({
      data: await this.dictionariesService.create(createDictionaryDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '字典详情' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number): Promise<R<DictionaryVo>> {
    console.log(
      await this.dictionariesService.findOneById(id),
      'await this.dictionariesService.findOneById(id)'
    )

    return new R({
      data: await this.dictionariesService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '字典详情' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @Get(':code')
  async findOneByCode(@Param('code') code: string): Promise<R<DictionaryVo>> {
    return new R({
      data: await this.dictionariesService.findOneByCode(code)
    })
  }

  @ApiOperation({ summary: '字典列表' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiPageQuery('searchText', 'date')
  @Get()
  async findMany(@Query() pageDictionaryDto: PageDictionaryDto): Promise<R<PageDictionaryVo>> {
    return new R({
      data: await this.dictionariesService.findMany(pageDictionaryDto)
    })
  }

  @ApiOperation({ summary: '更新字典' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiParam({ name: 'id', description: '字典 ID', required: true, example: 1 })
  @Put(':id(\\d+)')
  async update(
    @Param('id') id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @User('sub') userId: number
  ): Promise<R<DictionaryVo>> {
    return new R({
      data: await this.dictionariesService.update(id, updateDictionaryDto, userId)
    })
  }

  @ApiOperation({ summary: '修改字典' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @ApiParam({ name: 'id', description: '字典 ID', required: true, example: 1 })
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchSettingDto: PatchSettingDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.dictionariesService.patch(id, patchSettingDto, userId)
    return new R({
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除字典' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @ApiParam({ name: 'id', description: '字典 ID', required: true, example: 1 })
  @Delete(':id(\\d+)')
  async remove(
    @Param('id') id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.dictionariesService.remove(id, userId)
    return new R({
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
