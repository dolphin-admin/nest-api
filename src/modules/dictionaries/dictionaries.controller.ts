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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiPageOKResponse,
  ApiPageQuery,
  User
} from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { DictionariesService } from './dictionaries.service'
import {
  CreateDictionaryDto,
  PageDictionaryDto,
  PatchDictionaryDto,
  UpdateDictionaryDto
} from './dto'
import type { PageDictionaryVo } from './vo'
import { DictionaryVo } from './vo'

@ApiTags('字典')
@ApiBearerAuth('bearer')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @ApiOperation({ summary: '创建字典' })
  @ApiCreatedResponse(DictionaryVo)
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

  @ApiOperation({ summary: '字典列表' })
  @ApiPageOKResponse(DictionaryVo)
  @ApiPageQuery('searchText', 'date')
  @Get()
  async findMany(@Query() pageDictionaryDto: PageDictionaryDto): Promise<R<PageDictionaryVo>> {
    return new R({ data: await this.dictionariesService.findMany(pageDictionaryDto) })
  }

  @ApiOperation({ summary: '字典详情 [ID]' })
  @ApiOkResponse(DictionaryVo)
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number): Promise<R<DictionaryVo>> {
    return new R({ data: await this.dictionariesService.findOneById(id) })
  }

  @ApiOperation({ summary: '字典详情 [Code]' })
  @ApiOkResponse(DictionaryVo)
  @Get(':code')
  async findOneByCode(@Param('code') code: string): Promise<R<DictionaryVo>> {
    return new R({ data: await this.dictionariesService.findOneByCode(code) })
  }

  @ApiOperation({ summary: '更新字典' })
  @ApiOkResponse(DictionaryVo)
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @User('sub') userId: number
  ): Promise<R<DictionaryVo>> {
    return new R({ data: await this.dictionariesService.update(id, updateDictionaryDto, userId) })
  }

  @ApiOperation({ summary: '修改字典' })
  @ApiOkResponse()
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchDictionaryDto: PatchDictionaryDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.dictionariesService.patch(id, patchDictionaryDto, userId)
    return new R({ msg: i18n.t('common.OPERATE.SUCCESS') })
  }

  @ApiOperation({ summary: '删除字典' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ): Promise<R> {
    await this.dictionariesService.remove(id, userId)
    return new R({ msg: i18n.t('common.DELETE.SUCCESS') })
  }
}
