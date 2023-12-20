import { Lang } from '@dolphin-admin/utils'
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import { ApiCreatedResponse, ApiOkResponse, ApiPageOKResponse, ApiPageQuery } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { PageLocaleDto } from './dto'
import { CreateLocaleDto } from './dto/create-locale.dto'
import { UpdateLocaleDto } from './dto/update-locale.dto'
import { LocalesService } from './locales.service'
import { LocaleResourceVO, LocaleVo } from './vo'

@ApiTags('多语言资源')
@ApiBearerAuth('bearer')
@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @ApiOperation({ summary: '创建多语言资源' })
  @ApiCreatedResponse(LocaleVo)
  @Post()
  async create(
    @Body() createLocaleDto: CreateLocaleDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.localesService.create(createLocaleDto),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '多语言资源列表' })
  @ApiPageOKResponse(PageLocaleDto)
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findAll(@Query() pageLocaleDto: PageLocaleDto) {
    return new R({ data: await this.localesService.findAll(pageLocaleDto) })
  }

  @ApiOperation({ summary: '多语言资源 [根据语言]' })
  @ApiOkResponse(LocaleResourceVO, { isArray: true })
  @ApiParam({ name: 'lang', description: '语言标识', enum: Lang, example: Lang['en-US'] })
  @Get(':lang')
  async findManyByLang(
    @Param(
      'lang',
      new ParseEnumPipe(Lang, {
        exceptionFactory: () => {
          const i18n = I18nContext.current<I18nTranslations>()!
          throw new NotFoundException(i18n.t('common.LANGUAGE.NOT.SUPPORT'))
        }
      })
    )
    lang: string
  ) {
    return new R({ data: await this.localesService.findManyByLang(lang) })
  }

  @ApiOperation({ summary: '多语言资源详情' })
  @ApiOkResponse(LocaleVo)
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return new R({ data: await this.localesService.findOneById(id) })
  }

  @ApiOperation({ summary: '修改多语言资源' })
  @ApiOkResponse(LocaleVo)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocaleDto: UpdateLocaleDto,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.localesService.update(id, updateLocaleDto),
      msg: i18n.t('common.UPDATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除多语言资源' })
  @ApiOkResponse()
  @Delete(':id')
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.localesService.remove(id)
    return new R({ msg: i18n.t('common.DELETE.SUCCESS') })
  }
}
