import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { ApiPageQuery, PageDateDto } from '@/common'

import { DictionariesService } from './dictionaries.service'
import { CreateDictionaryDto } from './dto/create-dictionary.dto'
import { UpdateDictionaryDto } from './dto/update-dictionary.dto'

@ApiTags('数据字典')
@ApiBearerAuth('bearer')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @ApiOperation({ summary: '创建字典' })
  @ApiCreatedResponse({ description: '创建成功' })
  @ApiBadRequestResponse({ description: '输入有误' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiConflictResponse({ description: '字典代码已存在' })
  @Post()
  create(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionariesService.create(createDictionaryDto)
  }

  @ApiOperation({ summary: '字典列表' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiPageQuery('searchText', 'date')
  @Get()
  findMany(@Query() pageDto: PageDateDto) {
    return this.dictionariesService.findMany(pageDto)
  }

  @ApiOperation({ summary: '字典详情' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.dictionariesService.findOne(id)
  }

  @ApiOperation({ summary: '更新字典' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @ApiParam({ name: 'id', description: '字典 ID', required: true, example: 1 })
  @Patch(':id(\\d+)')
  update(
    @Param('id') id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto
  ) {
    return this.dictionariesService.update(id, updateDictionaryDto)
  }

  @ApiOperation({ summary: '删除字典' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '字典不存在' })
  @ApiParam({ name: 'id', description: '字典 ID', required: true, example: 1 })
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.dictionariesService.remove(id)
  }
}
