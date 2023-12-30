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
  ApiCreatedObjectResponse,
  ApiOkObjectResponse,
  ApiOkResponse,
  ApiPageOKResponse,
  ApiPageQuery,
  Jwt
} from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { CreateUserDto, PageUserDto, PatchUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'
import { UserVo } from './vo'

@ApiTags('用户')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedObjectResponse(UserVo)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.usersService.create(createUserDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '用户列表' })
  @ApiPageOKResponse(UserVo)
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findMany(@Query() pageUserDto: PageUserDto) {
    return new R({ data: await this.usersService.findMany(pageUserDto) })
  }

  @ApiOperation({ summary: '个人信息' })
  @ApiOkObjectResponse(UserVo)
  @Get('me')
  async findCurrent(@Jwt('sub') id: number) {
    return new R({ data: await this.usersService.findOneById(id) })
  }

  @ApiOperation({ summary: '用户详情 [id]' })
  @ApiOkObjectResponse(UserVo)
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number) {
    return new R({ data: await this.usersService.findOneById(id) })
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiOkObjectResponse(UserVo)
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.usersService.update(id, updateUserDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改用户' })
  @ApiOkObjectResponse(UserVo)
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchUserDto: PatchUserDto,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new R({
      data: await this.usersService.patch(id, patchUserDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @Jwt('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.usersService.remove(id, userId)
    return new R({
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
