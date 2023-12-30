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
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import {
  ApiCreatedObjectResponse,
  ApiOkObjectResponse,
  ApiOkResponse,
  ApiPageOKResponse,
  ApiPageQuery,
  Jwt
} from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { DictionaryItemsService } from './dictionary-items.service'
import {
  CreateDictionaryItemDto,
  PageDictionaryItemDto,
  PatchDictionaryItemDto,
  UpdateDictionaryItemDto
} from './dto'
import { DictionaryItemVo } from './vo'

@ApiTags('字典数据')
@ApiBasicAuth('bearer')
@Controller('dictionary-items')
export class DictionaryItemsController {
  constructor(private readonly dictionaryItemsService: DictionaryItemsService) {}

  @ApiOperation({ summary: '创建字典项' })
  @ApiCreatedObjectResponse(DictionaryItemVo)
  @Post()
  async create(
    @Body() createDictionaryDto: CreateDictionaryItemDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionaryItemsService.create(createDictionaryDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '字典项列表' })
  @ApiPageOKResponse(DictionaryItemVo)
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findMany(@Query() pageDictionaryItemDto: PageDictionaryItemDto) {
    return new R({
      data: await this.dictionaryItemsService.findMany(pageDictionaryItemDto)
    })
  }

  @ApiOperation({ summary: '字典项详情' })
  @ApiOkObjectResponse(DictionaryItemVo)
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number) {
    return new R({
      data: await this.dictionaryItemsService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '更新字典项' })
  @ApiOkObjectResponse(DictionaryItemVo)
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateDictionaryItemDto: UpdateDictionaryItemDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionaryItemsService.update(id, updateDictionaryItemDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改字典项' })
  @ApiOkObjectResponse(DictionaryItemVo)
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchDictionaryItemDto: PatchDictionaryItemDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionaryItemsService.patch(id, patchDictionaryItemDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除字典项' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.dictionaryItemsService.remove(id, userId)
    return new R({
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
