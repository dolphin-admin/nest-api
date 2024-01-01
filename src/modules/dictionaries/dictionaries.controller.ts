import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
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
import { ApiOkArrayResponse } from '@/decorators/swagger/api-ok-array-response.decorator'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { DictionariesService } from './dictionaries.service'
import {
  CreateDictionaryDto,
  PageDictionaryDto,
  PatchDictionaryDto,
  UpdateDictionaryDto
} from './dto'
import { DictionaryVo, ListDictionarySelectItemVo } from './vo'
import { DictionarySelectItemVo } from './vo/dictionary-select-item.vo'

@ApiTags('字典')
@ApiBearerAuth('bearer')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @ApiOperation({ summary: '创建字典' })
  @ApiCreatedObjectResponse(DictionaryVo)
  @Post()
  async create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionariesService.create(createDictionaryDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '字典列表' })
  @ApiPageOKResponse(DictionaryVo)
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findMany(@Query() pageDictionaryDto: PageDictionaryDto) {
    return new R({
      data: await this.dictionariesService.findMany(pageDictionaryDto)
    })
  }

  @ApiOperation({ summary: '字典详情 [ID]' })
  @ApiOkObjectResponse(DictionaryVo)
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number) {
    return new R({
      data: await this.dictionariesService.findOneById(id)
    })
  }

  @ApiOperation({ summary: '字典数据 [Codes]' })
  @ApiOkArrayResponse(ListDictionarySelectItemVo)
  @ApiExtraModels(DictionarySelectItemVo)
  @ApiQuery({
    name: 'codes',
    description: '字典编码（多个编码用逗号分隔）',
    type: String,
    required: true,
    example: 'AUTH_TYPE,GENDER'
  })
  @Get('codes')
  async findManyByCodes(
    @Query('codes', new ParseArrayPipe({ items: String, separator: ',' })) codes: string[]
  ) {
    return new R({
      data: await this.dictionariesService.findManyByCodes(codes)
    })
  }

  @ApiOperation({ summary: '字典数据 [Code]' })
  @ApiOkObjectResponse(ListDictionarySelectItemVo)
  @Get(':code')
  async findOneByCode(@Param('code') code: string) {
    return new R({
      data: await this.dictionariesService.findOneByCode(code)
    })
  }

  @ApiOperation({ summary: '更新字典' })
  @ApiOkObjectResponse(DictionaryVo)
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionariesService.update(id, updateDictionaryDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改字典' })
  @ApiOkObjectResponse(DictionaryVo)
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchDictionaryDto: PatchDictionaryDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.dictionariesService.patch(id, patchDictionaryDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除字典' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.dictionariesService.remove(id, userId)
    return new R({ msg: i18n.t('common.DELETE.SUCCESS') })
  }
}
